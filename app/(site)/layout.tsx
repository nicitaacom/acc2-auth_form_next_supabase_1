import { Navbar } from "@/components/Navbar/Navbar"

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
