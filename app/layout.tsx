import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DentaCare - Diş Hekimliği Kliniği",
  description: "Sağlıklı gülüşler için profesyonel diş bakımı hizmetleri",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <footer className="text-center text-sm text-gray-500 py-4 border-t group">
              <span className="inline-block animate-spin-slow hover:rotate-180 transition-transform duration-500">
                🦷
              </span>
              <span className="mx-2 inline-block animate-pulse-heart text-red-500">
                ❤️
              </span>
              <span className="font-medium group-hover:text-black transition-colors duration-300">
                2025 Berke Benli & Elif Alınca & Göktuğ Ormanlı
              </span>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
