import { Baloo_2, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
  weight: ["600", "700", "800"]
});

export const metadata = {
  title: "Happy Birthday ANFAL",
  description: "A soft pink plush birthday surprise experience."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${baloo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
