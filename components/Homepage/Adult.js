import ButtonOnClick from "../UI/Buttons/ButtonOnClick";
import classes from "./Adult.module.css";
import Image from "next/image";

export default function Adult(props) {
  return (
    <div className={classes.container}>
      <div className={classes.logo} href={"/"}>
        <p>
          <i>Huki Muki</i>
        </p>
        <p>Club</p>
      </div>
      <h1>Czy jesteś pełnoletni?</h1>
      <div className={classes.buttonsContainer}>
        <ButtonOnClick text="Tak" onClick={props.ageHandler} />
        <ButtonOnClick text="Nie" onClick={props.negativeAge} />
      </div>
      <Image
        src={"/gifs/1.gif"}
        width={250}
        height={300}
        alt="drogowskaz"
      ></Image>
    </div>
  );
}
