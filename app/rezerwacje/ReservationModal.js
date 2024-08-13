import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./ReservationModal.module.css";
import Link from "next/link";

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
  const [email, setEmail] = useState("dominik.jojczyk@gmail.com");
  const [phone, setPhone] = useState("576985894");
  const [occupiedDates, setOccupiedDates] = useState([]);

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
    const day = date.toLocaleDateString("en-CA"); // format 'YYYY-MM-DD'
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if the date is occupied
    const isDateOccupied = occupiedDates.includes(day);

    // Club is only available on Friday and Saturday
    if (isClub) {
      return !isDateOccupied && (dayOfWeek === 5 || dayOfWeek === 6);
    }

    // Non-club is available every day
    return !isDateOccupied;
  };

  const handleDateChange = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    const formattedDate = localDate.toLocaleDateString("en-CA"); // format 'YYYY-MM-DD'

    if (isAvailableDate(localDate)) {
      setSelectedDate(localDate);
    } else {
      alert("Wybrana data jest niedostępna.");
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime || !name || !phone || !email) {
      alert("Proszę wypełnić wszystkie pola przed dokonaniem płatności.");
      return;
    }

    const reservationData = {
      name,
      email,
      phone,
      date: formattedDate,
      time: selectedTime,
      price,
      lvl,
      isClub,
      title,
    };

    try {
      const response = await fetch("http://localhost:3000/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zrealizować rezerwacji");
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Błąd podczas rezerwacji:", error);
      alert("Wystąpił problem podczas rezerwacji. Spróbuj ponownie później.");
    }
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

  const formattedDate = selectedDate.toLocaleDateString();

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
          <h3>{price}</h3>
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
            <label>Imię:</label>
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
            {formattedDate} jest przygotowana
          </p>
          <p>Zapłać aby ją potwierdzić</p>
          <Link href="https://buy.stripe.com/test_dR69BCeze1TQ3QIeV7">
            Zaplać
          </Link>
        </div>
      )}
    </Modal>
  );
};

export default ReservationModal;
