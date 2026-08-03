import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Dynamis Relay — Support that moves with you", template: "%s | Dynamis Relay" },
  description: "An AI-native customer support platform for fast, reliable, human-controlled service.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: { title: "Dynamis Relay", description: "Resolve faster. Stay human.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
