import Menu from "./Menu";

import { Metadata } from "next";

export const metadata = {
  title: "Nasze Menu - HukiMuki",
  description:
    "Odkryj nasze bogate menu pełne kreatywnych drinków, shotów i promocji, które idealnie pasują do imprezowej atmosfery HukiMuki.",
  alternates: {
    canonical: "/menu",
  },
};

export default function Men() {
  return <Menu />;
}
