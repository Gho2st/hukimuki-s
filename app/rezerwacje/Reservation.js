"use client";
import React, { useState } from "react";
import classes from "./Reservation.module.css";
import Reservationitem from "./ReservationItem";
import ReservationModal from "./ReservationModal";

export default function Reservation() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedReservation(null);
  };

  return (
    <>
      <div className={classes.container}>
        <Reservationitem
          title="CLUB - 5 osób"
          lvl="Poziom -1"
          price="250zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({ title: "CLUB - 5 osób", price: "250zł", isClub: true })
          }
        />
        <Reservationitem
          title="CLUB - 6 osób"
          lvl="Poziom -1"
          price="300zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({ title: "CLUB - 6 osób", price: "300zł", isClub: true })
          }
        />
        {/* Dodaj kolejne Reservationitem z odpowiednimi danymi */}
      </div>

      {selectedReservation && (
        <ReservationModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          title={selectedReservation.title}
          price={selectedReservation.price}
          isClub={selectedReservation.isClub}
        />
      )}
    </>
  );
}
