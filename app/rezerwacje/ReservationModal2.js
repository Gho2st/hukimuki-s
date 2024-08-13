import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./ReservationModal.module.css";

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
  const [occupiedTimes, setOccupiedTimes] = useState([]);

  const isAvailableDate = (date) => {
    if (isClub) {
      const day = date.getDay();
      return day === 5 || day === 6;
    }
    return true;
  };

  const handleDateChange = async (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      )
    );

    if (isAvailableDate(utcDate)) {
      setSelectedDate(utcDate);

      try {
        const response = await fetch(
          "http://localhost:3000/api/get-occupied-dates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date: utcDate.toISOString(), title: title }),
          }
        );

        if (response.ok) {
          const { occupiedTimes } = await response.json();
          console.log(occupiedTimes);
          if (Array.isArray(occupiedTimes)) {
            setOccupiedTimes(occupiedTimes);
          } else {
            console.error("Unexpected response format:", occupiedTimes);
          }
        } else {
          console.error("Failed to fetch occupied dates");
        }
      } catch (error) {
        console.error("Error fetching occupied times:", error);
      }
    } else {
      alert("Wybierz piątek lub sobotę dla rezerwacji klubu.");
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
      date: selectedDate.toISOString(),
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
    const allTimes = isClub
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

    return allTimes;
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
            tileClassName={({ date }) =>
              !isAvailableDate(date) ? classes.disabledDate : undefined
            }
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
            {formattedDate} jest gotowa
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ReservationModal;
