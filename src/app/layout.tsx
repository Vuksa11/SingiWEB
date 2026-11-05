import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Zaglavlje from "@/components/zaglavlje";
import Podnozje from "@/components/podnozje";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "VK Singidunum | Vaterpolo klub", template: "%s | VK Singidunum" },
  description: "Zvanični sajt Vaterpolo kluba Singidunum iz Beograda — vesti, raspored, tabela i ekipa.",
  icons: { icon: "/grb.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1628" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen antialiased">
        <Zaglavlje />
        <main>{children}</main>
        <Podnozje />
      </body>
    </html>
  );
}
