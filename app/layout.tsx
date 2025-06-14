import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flight Selector",
  description: "Select your flight and add it to your calendar",
  generator: 'v0.dev',
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
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
