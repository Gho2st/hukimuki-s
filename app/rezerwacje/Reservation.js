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
        {/* <Reservationitem
          title="Antresola - 4 osoby"
          lvl="Poziom 0"
          price="300zł"
          when="Rezerwacja dostępna przez 7 dni w tygodniu."
          onClick={() =>
            openModal({
              title: "Antresola - 4 osoby",
              price: 300,
              isClub: false,
              lvl: "Poziom 0",
            })
          }
        />
        <Reservationitem
          title="Antresola - 6 osób"
          lvl="Poziom 0"
          price="300zł"
          when="Rezerwacja dostępna przez 7 dni w tygodniu."
          onClick={() =>
            openModal({
              title: "Antresola - 6 osób",
              price: 300,
              isClub: false,
              lvl: "Poziom 0",
            })
          }
        />
        <Reservationitem
          title="Antresola - 7 osób"
          lvl="Poziom 0"
          price="350zł"
          when="Rezerwacja dostępna przez 7 dni w tygodniu."
          onClick={() =>
            openModal({
              title: "Antresola - 7 osób",
              price: 350,
              isClub: false,
              lvl: "Poziom 0",
            })
          }
        />
        <Reservationitem
          title="Antresola - 8 osób"
          lvl="Poziom 0"
          price="400zł"
          when="Rezerwacja dostępna przez 7 dni w tygodniu."
          onClick={() =>
            openModal({
              title: "Antresola - 8 osób",
              price: 400,
              isClub: false,
              lvl: "Poziom 0",
            })
          }
        /> */}
        <Reservationitem
          title="CLUB - 2 osoby"
          lvl="Poziom -1"
          price="100zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 2 osoby",
              price: 100,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 4 osoby"
          lvl="Poziom -1"
          price="200zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 4 osoby",
              price: 200,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 5 osób"
          lvl="Poziom -1"
          price="250zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 5 osób",
              price: 250,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 6 osób"
          lvl="Poziom -1"
          price="300zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 6 osób",
              price: 300,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 7 osób"
          lvl="Poziom -1"
          price="350zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 7 osób",
              price: 350,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 8 osób"
          lvl="Poziom -1"
          price="400zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 8 osób",
              price: 400,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 9 osób"
          lvl="Poziom -1"
          price="450zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 9 osób",
              price: 450,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 10 osób"
          lvl="Poziom -1"
          price="500zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 10 osób",
              price: 500,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
        <Reservationitem
          title="CLUB - 12 osób"
          lvl="Poziom -1"
          price="600zł"
          when="Rezerwacja dostępna tylko w piątki i soboty."
          onClick={() =>
            openModal({
              title: "CLUB - 12 osób",
              price: 600,
              isClub: true,
              lvl: "Poziom -1",
            })
          }
        />
      </div>

      {selectedReservation && (
        <ReservationModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          title={selectedReservation.title}
          price={selectedReservation.price}
          isClub={selectedReservation.isClub}
          lvl={selectedReservation.lvl}
        />
      )}
    </>
  );
}
