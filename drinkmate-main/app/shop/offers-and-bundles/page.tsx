"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function OffersAndBundlesPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const prefix = pathname?.startsWith("/ar") ? "/ar" : ""
    router.replace(prefix + "/shop/sodamakers")
  }, [router, pathname])

  return null
}
