import type { MetadataRoute } from "next";

/** /manifest.webmanifest — basic installability/PWA metadata. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TKR Insurance Brokerage",
    short_name: "TKR",
    description:
      "Insurance for everyone working and living in Thailand — worker, auto, travel, PA and fire, in 4 languages.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    // --color-ink-700 from globals.css — primary navy used across the site.
    theme_color: "#163c6c",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
