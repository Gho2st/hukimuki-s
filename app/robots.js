import { MetadataRoute } from "next";
import { userAgent } from "next/server";
import sitemap from "./sitemap";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/privacy"],
      },
    ],
    sitemap: `https://www.hukimuki.pl/sitemap.xml`,
  };
}
