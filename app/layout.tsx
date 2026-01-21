import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phorn & Mey Wedding",
  description: "You are invited to celebrate the wedding of Phorn & Mey",
  icons: {
    // Use existing logo as favicon for all contexts
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased relative`}>
        <AnimatedBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
