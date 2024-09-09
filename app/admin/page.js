import Admin from "./Admin";
import { Metadata } from "next";

export const metadata = {
  title: "Panel admina",
  alternates: {
    canonical: "/admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return (
    <>
      <Admin />
    </>
  );
}
