import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUBSCIO — Signals Harvesting Engine",
  description:
    "AI-powered business signals intelligence platform. Capture, analyze, and act on buying signals, hiring intent, and market shifts in real-time.",
  keywords: [
    "sales intelligence",
    "AI automation",
    "lead scoring",
    "signal harvesting",
    "intent analysis",
  ],
};

import { GlobalProvider } from "./context/GlobalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} dark h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
