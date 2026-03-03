import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "FlightCal",
  description: "Select your flight and add it to your calendar",
  icons: {
    icon: '/flight-logo.png',
    shortcut: '/flight-logo.png',
    apple: '/flight-logo.png',
  },
  openGraph: {
    images: ['https://flight-cal.vercel.app/screenshot.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
