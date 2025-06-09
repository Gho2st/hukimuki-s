import { Poppins } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/animations/TransitionProvider";
import { GoogleTagManager } from "@next/third-parties/google";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.hukimuki.pl"),
  verification: {
    google: "jt-hIw0SxnDOp4XvZmGObx9Fajs9spuEDqiqIeSnG0o",
  },
  keywords: [
    "HukiMuki",
    "pub Kraków",
    "klub muzyczny Kraków",
    "imprezy Kraków",
    "nocne życie Kraków",
    "drinki Kraków",
    "dj Kraków",
    "promocje Kraków",
    "piwo Kraków",
    "shoty Kraków",
  ],
  title: {
    default: "HukiMuki - Pub i Klub Muzyczny w Krakowie",
    template: "%s - HukiMuki Kraków",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://www.hukimuki.pl/",
    title: "HukiMuki - Pub i Klub Muzyczny w Krakowie",
    description:
      "Dołącz do nas w HukiMuki, najlepszym klubie w Krakowie. Sprawdź nasze drinki, promocje i wyjątkowe imprezy z muzyką na żywo.",
    images: "/opengraph-image.png",
  },
  description:
    "HukiMuki to pub i klub w sercu Krakowa, gdzie czeka na Ciebie doskonałe piwo, kreatywne drinki i wyjątkowe shoty. Zanurz się w żywej atmosferze z muzyką i świetnym towarzystwie.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <GoogleTagManager gtmId="GTM-THZF9JRL" />
      <body className={poppins.className}>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
