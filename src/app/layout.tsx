"use client";
import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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
  children: React.ReactNode; // quando clicar no x tem que fazer refetch
}>) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            {children}
            <CacheMenu />
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
