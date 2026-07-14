if (typeof window === 'undefined' && typeof global !== 'undefined' && (global as any).localStorage) {
  try {
    delete (global as any).localStorage;
  } catch (e) {}
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import SnowflakesBackground from "@/components/snowflakes-background"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FROZEN THREAD - Premium Streetwear & Fashion",
  description:
    "Discover premium streetwear and fashion at FROZEN THREAD. Unique designs, quality materials, and authentic style for the modern generation.",
  keywords: "streetwear, fashion, clothing, premium, frozen thread, urban wear, style",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SnowflakesBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
