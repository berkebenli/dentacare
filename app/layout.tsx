import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";  // <-- artık kendi ThemeProvider'ımızı kullanıyoruz

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DentaCare - Diş Hekimliği Kliniği",
  description: "Sağlıklı gülüşler için profesyonel diş bakımı hizmetleri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
