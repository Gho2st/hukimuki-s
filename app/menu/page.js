import Menu from "./Menu";

import { Metadata } from "next";

export const metadata = {
  title: "Menu",
  alternates: {
    canonical: "/menu",
  },
};

export default function Men() {
  return <Menu />;
}
