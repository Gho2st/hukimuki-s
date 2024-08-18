import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./ReservationModal.module.css";
import Link from "next/link";
import CheckoutPage from "@/components/stripe/CheckoutPage";

const ReservationModal = ({
  isOpen,
  onRequestClose,
  title,
  price,
  lvl,
  isClub,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [name, setName] = useState("Dominik Jojczyk");
  const [address, setAddress] = useState("Niskowa 36");
  const [email, setEmail] = useState("dominik.jojczyk@gmail.com");
  const [phone, setPhone] = useState("576985894");
  const [NIP, setNIP] = useState("");
  const [formattedDate, setFormattedDate] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [isCompany, setIsCompany] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const reservationData = {
    name,
    email,
    phone,
    date: formattedDate,
    time: selectedTime,
    isCompany,
    address,
    NIP,
    price,
    lvl,
    isClub,
    title,
  };

  useEffect(() => {
    const fetchOccupiedDates = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/get-occupied-dates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
          }
        );

        if (response.ok) {
          const { occupiedTimes } = await response.json();
          if (Array.isArray(occupiedTimes)) {
            // Convert dates to 'YYYY-MM-DD' format
            const formattedDates = occupiedTimes.map((date) =>
              new Date(date).toISOString().slice(0, 10)
            );
            setOccupiedDates(formattedDates);
          } else {
            console.error("Unexpected response format:", occupiedTimes);
          }
        } else {
          console.error("Failed to fetch occupied dates");
        }
      } catch (error) {
        console.error("Error fetching occupied dates:", error);
      }
    };

    fetchOccupiedDates();
  }, [title]);

  const isAvailableDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = date.toLocaleDateString("en-CA"); // format 'YYYY-MM-DD'
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const isDateInPast = date < today;

    // Check if the date is occupied
    const isDateOccupied = occupiedDates.includes(day);

    // Club is only available on Friday and Saturday
    if (isClub) {
      return (
        !isDateInPast && !isDateOccupied && (dayOfWeek === 5 || dayOfWeek === 6)
      );
    }
    // Non-club is available every day
    return !isDateOccupied && !isDateInPast;
  };

  const handleDateChange = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    // const formattedDate = localDate.toLocaleDateString("en-CA"); // format 'YYYY-MM-DD'

    setFormattedDate(localDate.toLocaleDateString("en-CA"));
    console.log(formattedDate);
    console.log(selectedDate);

    if (isAvailableDate(localDate)) {
      setSelectedDate(localDate);
      setErrorMessage(null);
    } else {
      setErrorMessage("Wybrana data jest niedostępna");
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime || !name || !phone || !email) {
      setErrorMessage(
        "Proszę wypełnić wszystkie pola przed dokonaniem płatności."
      );
      return;
    }
    setErrorMessage(null);
    setShowConfirmation(true);
  };

  const getAvailableTimes = () => {
    return isClub
      ? ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"]
      : [
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
          "22:30",
          "23:00",
          "23:30",
          "00:00",
        ];
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      {!showConfirmation ? (
        <>
          <h2>{title}</h2>
          <p>{lvl}</p>
          <h3>{price}zł</h3>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={({ date }) => {
              const day = date.toISOString().slice(0, 10);
              const isDayUnavailable = !isAvailableDate(date);
              const isDaySelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();

              if (isDaySelected) {
                return classes.selectedDate;
              }
              if (isDayUnavailable) {
                return classes.unavailableDate;
              }
              if (!isDayUnavailable) {
                return classes.enableDate;
              }
            }}
            className={classes.calendar}
          />
          {errorMessage && (
            <p className={classes.errorMessage}>{errorMessage}</p>
          )}
          <label>Wybierz godzinę:</label>
          <select value={selectedTime} onChange={handleTimeChange}>
            <option value="">Wybierz godzinę</option>
            {getAvailableTimes().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <div className={classes.personalInfo}>
            {!isCompany && <label>Imię:</label>}
            {isCompany && <label>Nazwa firmy:</label>}

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Numer telefonu:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>
              <input
                type="checkbox"
                checked={isCompany}
                onChange={() => setIsCompany(!isCompany)}
              />
              Zakup na firmę?
            </label>
            {isCompany && (
              <>
                <label>NIP:</label>
                <input
                  type="text"
                  value={NIP}
                  onChange={(e) => setNIP(e.target.value)}
                />
                <label>Kraj:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label>Adres firmy:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label>Ulica</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label>Numer</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label>Kod pocztowy</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            )}
          </div>

          <div className={classes.buttons}>
            <button onClick={handlePayment}>Kontynuuj</button>
            <button onClick={onRequestClose}>Anuluj</button>
          </div>
        </>
      ) : (
        <div>
          <h3>{name}</h3>
          <p>
            Twoja rezerwacja na {title} {lvl} o godzinie {selectedTime} w dniu
            {formattedDate} jest przygotowana, opłać a następnie wydrukuj sobie
            potwierdzenie.
            <br></br>
            Dziękujemy!
          </p>
          <CheckoutPage amount={price} reservationData={reservationData} />
        </div>
      )}
    </Modal>
  );
};

export default ReservationModal;
