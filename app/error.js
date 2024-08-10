"use client"; // Error components must be Client Components

import { useEffect } from "react";
import classes from "./error.module.css";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={classes.container}>
      <h2>Coś poszło nie tak!</h2>
      <div className={classes.buttons}>
        <Link href="/">Wróć na stronę główną</Link>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Spróbuj ponownie!
        </button>
      </div>
    </div>
  );
}
