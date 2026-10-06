import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Shivansh Nigam — Full-Stack Blockchain Developer",
  description:
    "Portfolio of Shivansh Nigam, full-stack blockchain developer: smart contracts on EVM and Solana, and the full-stack Web3 and AI products around them.",
  openGraph: {
    title: "Shivansh Nigam — Full-Stack Blockchain Developer",
    description: "Smart contracts to polished products.",
    images: ["/images/shivansh.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#090912",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
