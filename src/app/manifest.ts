import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "DentalJournal",
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#1e4e42",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
