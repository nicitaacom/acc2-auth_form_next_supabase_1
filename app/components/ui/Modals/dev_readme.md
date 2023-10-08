# Usage for modals

## Step 1 (in this folder)

```tsx
import { ModalContainer } from "../ModalContainer"

interface NameModalProps {
  label: string
}

export function NameModal({ label }: NameModalProps) {
  return (
    <ModalContainer className="any className" modalQuery="NameModal">
      {/* ANY CONTENT (to keep consistent keep {label})*/}
      <div className="flex flex-col gap-y-2">
        <h1>{label}</h1>
        <div className="text-black">Content for auth modal</div>
      </div>
    </ModalContainer>
  )
}
```

## Step 2

Export every modal in index.ts

## Step 3 (in ModalContainers folder)

```tsx
"use client"
import { useSearchParams } from "next/navigation"
import React from "react"

export function NameModalContainer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  return <>{searchParams.getAll("modal").includes("NameModal") && children}</>
}
```

## Step 4 (in components folder where you have button to open modal e.g Navbar/components)

```tsx
"use client"

import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/Button"

export default function OpenNameModalButton() {
  const pathname = usePathname()
  const updatedPath = pathname + (pathname.includes("?") ? "&" : "?") + "modal=" + "NameModal"

  return (
    <Button className="w-fit" href={updatedPath}>
      Open name modal
    </Button>
  )
}
```

## Step 5

Export every button in index.ts (e.g Navbar/components/index.ts)

## Step 6

Render NameModal as children NameModalContainer somewhere (e.g in layout.tsx)

```tsx
<NameModalContainer>
  <NameModal label="any name modal (e.g admin modal)" />
</NameModalContainer>
```

## Step 7

Render OpenNameModalButton.tsx somewhere (e.g in Navbar.tsx)

```tsx
<OpenNameModalButton />
```
