import Header from "../UI/Header/Header";
import Baner from "./Baner";
import classes from "./Homepage.module.css";
import Photos from "./Photos";
import Footer from "../UI/Footer/Footer";
import About from "./About";
import Contact from "../UI/Contact/Contact";
import Map from "../UI/Map";
import Events from "./Events";

export default function Homepage() {
  return (
    <>
      <Header />
      <Baner />
      <About />
      <Events />
      <Photos />
      <Map />
      <Footer />
    </>
  );
}
