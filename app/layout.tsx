import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xat — Gmail orqali xat yuboring",
  description: "Google bilan kiring va istalgan emailga o'z Gmail'ingizdan xat yuboring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
