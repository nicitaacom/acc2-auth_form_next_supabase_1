import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Navbar } from "./components/Navbar/Navbar"
import { Layout } from "./components/Layout"
import { ModalsProvider } from "./providers/ModalsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Auth with supabase",
  description: "Auth guide",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <ModalsProvider />
          <Navbar />
          {children}
        </Layout>
      </body>
    </html>
  )
}
