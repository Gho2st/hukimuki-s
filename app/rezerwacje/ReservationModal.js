import React, { useState } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./ReservationModal.module.css";
import Payment from "@/components/stripe/Payment";

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
  const [showPayment, setShowPayment] = useState(false); // Dodanie stanu do wyświetlania komponentu Payment

  // Stany dla nowych pól formularza
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isAvailableDate = (date) => {
    if (isClub) {
      const day = date.getDay();
      return day === 5 || day === 6;
    }
    return true;
  };

  const handleDateChange = (date) => {
    if (isAvailableDate(date)) {
      setSelectedDate(date);
    } else {
      alert("Wybierz piątek lub sobotę dla rezerwacji klubu.");
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handlePayment = () => {
    if (!selectedDate || !selectedTime || !name || !phone || !email) {
      alert("Proszę wypełnić wszystkie pola przed dokonaniem płatności.");
      return;
    }

    setShowPayment(true);
  };

  const getAvailableTimes = () => {
    if (isClub) {
      return ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"];
    } else {
      return [
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
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      {!showPayment ? (
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

          {/* Formularz danych osobowych */}
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
            <label>Number</label>
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
        <Payment
          title={title}
          lvl={lvl}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          amount={price}
          name={name}
          email={email}
          phone={phone}
        />
      )}
    </Modal>
  );
};

export default ReservationModal;
