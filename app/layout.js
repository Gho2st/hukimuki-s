import { Poppins } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/animations/TransitionProvider";
import { Metadata } from "next";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://hukimuki.pl"),
  title: {
    default: "HukiMuki - Pub i Klub Muzyczny w Krakowie",
    template: "%s - HukiMuki Kraków",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
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
