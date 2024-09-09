import Contact from "@/components/UI/Contact/Contact";
import classes from "./page.module.css";
import Header from "@/components/UI/Header/Header";
import Footer from "@/components/UI/Footer/Footer";
import { Metadata } from "next";

export const metadata = {
  title: "Kontakt",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function Kontakt() {
  return (
    <div classes={classes.container}>
      <Header />
      <Contact />
      <Footer />
    </div>
  );
}
