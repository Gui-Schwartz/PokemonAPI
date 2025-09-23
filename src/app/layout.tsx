"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { CacheProvider } from "@/components/cache-provider";
import { cacheButtonStyle } from "@/utils/styles";
import { FolderClock } from "lucide-react";
import { CacheMenu } from "@/components/cache-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CacheProvider>
          {children}
          <CacheMenu />
        </CacheProvider>
      </body>
    </html>
  );
}
