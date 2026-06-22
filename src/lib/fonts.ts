import {
  Anuphan,
  IBM_Plex_Sans_Thai,
  Noto_Sans_Myanmar,
  Noto_Sans_Lao,
} from "next/font/google";

/**
 * Self-hosted fonts (next/font downloads + serves them at build time —
 * replaces the original Google Fonts @import in brand.css).
 *
 * Anuphan covers Thai + Latin (the design's display/UI face). It does NOT
 * cover Burmese or Lao script, so we add Noto Sans Myanmar / Lao as
 * script-appropriate fallbacks. The CSS `--font-sans` stack (globals.css)
 * lists them after Anuphan, so the browser falls through per codepoint.
 */
export const anuphan = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

export const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

export const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-my",
  display: "swap",
  preload: false,
});

export const notoLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-lo",
  display: "swap",
  preload: false,
});

/** Combined CSS-variable class list to put on <html>. */
export const fontVariables = [
  anuphan.variable,
  plexThai.variable,
  notoMyanmar.variable,
  notoLao.variable,
].join(" ");
