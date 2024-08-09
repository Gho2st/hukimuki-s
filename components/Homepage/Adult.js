import classes from "./Adult.module.css";
import Image from "next/image";

export default function Adult(props) {
  return (
    <div className={classes.container}>
      <Image src={"/logo.png"} width={380} height={280}></Image>
      <h1>Czy jesteś pełnoletni?</h1>
      <div className={classes.buttonsContainer}>
        <button onClick={props.ageHandler}>Tak</button>
        <button onClick={props.negativeAge}>Nie</button>
      </div>
      <Image src={"/gifs/1.gif"} width={250} height={300}></Image>
    </div>
  );
}
