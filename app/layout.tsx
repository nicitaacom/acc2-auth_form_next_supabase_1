import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Layout } from "./components/Layout"
import { ModalsProvider } from "./providers/ModalsProvider"
import ClientOnly from "./components/ClientOnly"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Auth with supabase",
  description: "Auth guide",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: "#202020" }}>
        <ClientOnly>
          <Layout>
            <ModalsProvider />
            {children}
          </Layout>
        </ClientOnly>
      </body>
    </html>
  )
}
