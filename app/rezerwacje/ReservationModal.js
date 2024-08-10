import React, { useState } from "react";
import Modal from "react-modal";
import classes from "./ReservationModal.module.css";

const ReservationModal = ({ isOpen, onRequestClose, title, price, isClub }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const day = date.getDay(); // 0 = Niedziela, 1 = Poniedziałek, ..., 5 = Piątek, 6 = Sobota

    // Sprawdzamy czy jest to piątek (5) lub sobota (6)
    if (isClub && day !== 5 && day !== 6) {
      alert("Wybierz piątek lub sobotę dla rezerwacji klubu.");
      setSelectedDate(""); // Resetujemy wybraną datę
    } else {
      setSelectedDate(e.target.value);
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handlePayment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Wybierz datę i godzinę przed dokonaniem płatności.");
      return;
    }

    // Logika płatności
    alert(
      `Płatność zrealizowana za rezerwację na ${selectedDate} o godzinie ${selectedTime}!`
    );
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={classes.modal}
      overlayClassName={classes.overlay}
    >
      <h2>{title}</h2>
      <p>Cena: {price}</p>
      <label>Wybierz datę:</label>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <label>Wybierz godzinę:</label>
      <select value={selectedTime} onChange={handleTimeChange}>
        <option value="">Wybierz godzinę</option>
        <option value="21:00">21:00</option>
        <option value="21:30">21:30</option>
        <option value="22:00">22:00</option>
        <option value="22:30">22:30</option>
        <option value="23:00">23:00</option>
        <option value="23:30">23:30</option>
        <option value="00:00">00:00</option>
      </select>
      <button onClick={handlePayment}>Zapłać</button>
      <button onClick={onRequestClose}>Anuluj</button>
    </Modal>
  );
};

export default ReservationModal;
