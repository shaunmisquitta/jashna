import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Parisienne } from "next/font/google";
import { wedding } from "./wedding.config";
import "./globals.css";

const display = Cinzel({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500"] });
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const script = Parisienne({ variable: "--font-script", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: `${wedding.title} · ${wedding.bride} & ${wedding.groom}`,
  description: wedding.inviteLine,
};

export const viewport: Viewport = {
  themeColor: "#4d0c18",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${script.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
