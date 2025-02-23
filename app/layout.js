import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: false
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: false
});

export const metadata = {
  title: "NoFap Counter - Track Your Progress & Achieve Self-Mastery",
  description:
    "NoFap Counter is a comprehensive app designed to help you track your no fap journey. Monitor your streaks, celebrate milestones, and gain insights to boost your self-discipline and personal growth.",
  keywords:
    "NoFap, NoFap Counter, self-improvement, personal growth, streak tracker, habit tracking, mental health, productivity, self-discipline",
  authors: [{ name: "Your Company Name", url: "https://yourwebsite.com" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

