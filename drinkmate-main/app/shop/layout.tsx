"use client"

import FloatingBackButton from "@/components/ui/FloatingBackButton"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingBackButton />
    </>
  )
}
