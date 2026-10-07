import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {

  openGraph: {
    title: "CVForge — AI-Powered CV Builder",
    description:
      "Build a professional CV in minutes with customizable templates, AI-powered improvements, ATS analysis, CV management, and PDF export.",
    siteName: "CVForge",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "CVForge — AI-Powered CV Builder",
    description:
      "Build a professional CV in minutes with customizable templates, AI-powered improvements, ATS analysis, CV management, and PDF export.",
  },

  title: {
    default: "CVForge — AI-Powered CV Builder",
    template: "%s | CVForge",
  },
  description:
    "Build a professional CV in minutes with customizable templates, AI-powered improvements, ATS analysis, CV management, and PDF export.",
  applicationName: "CVForge",
  keywords: [
    "CV builder",
    "resume builder",
    "AI CV builder",
    "AI resume builder",
    "ATS resume builder",
    "professional CV",
    "CV maker",
  ],
  authors: [{ name: "CVForge" }],
  creator: "CVForge",
  publisher: "CVForge",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
