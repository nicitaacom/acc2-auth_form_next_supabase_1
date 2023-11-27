import { Metadata } from "next"

export const metadata: Metadata = {
  title: "23_store - error",
  description: "Error better than amazon",
}

export default function ErrorsLayout({ children }: { children: React.ReactNode }) {
  return children
}
