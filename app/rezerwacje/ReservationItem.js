import Button from "@/components/UI/Buttons/Button";
import classes from "./Reservationitem.module.css";
import ButtonOnClick from "@/components/UI/Buttons/ButtonOnClick";

export default function Reservationitem(props) {
  return (
    <>
      <div className={classes.container}>
        <h2>{props.title}</h2>
        <p className={classes.text2}>{props.lvl}</p>
        <h3>{props.price}</h3>
        <p>{props.when}</p>
        {/* <Button text="Rezerwuj" href="/"></Button> */}
        <ButtonOnClick onClick={props.onClick} text="Rezerwuj" />
      </div>
    </>
  );
}
