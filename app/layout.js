import { Poppins } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/animations/TransitionProvider";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "HukiMuki - Pub i Klub Muzyczny w Krakowie",
  description:
    "HukiMuki to pub i klub w sercu Krakowa, gdzie czeka na Ciebie doskonałe piwo, kreatywne drinki i wyjątkowe shoty. Zanurz się w żywej atmosferze z muzyką i świetnym towarzystwie. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={poppins.className}>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
