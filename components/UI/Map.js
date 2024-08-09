import classes from "./Map.module.css";
export default function Map() {
  return (
    <div className={classes.mapContainer}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.21112568472!2d19.937717776513338!3d50.06360761514192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b11d155acd3%3A0x5af93380367aa388!2sHuki%20Muki%20pub%20%26%20club!5e0!3m2!1spl!2spl!4v1722935413023!5m2!1spl!2spl"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
