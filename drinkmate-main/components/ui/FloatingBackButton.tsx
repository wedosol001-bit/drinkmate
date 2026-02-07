"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/contexts/translation-context"

/**
 * Floating back button - visible only on mobile (md and up: hidden).
 * Navigates to previous page via history.back().
 */
export default function FloatingBackButton() {
  const router = useRouter()
  const { isRTL } = useTranslation()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/shop")
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`md:hidden fixed bottom-6 z-50 h-12 w-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-[#12d6fa] hover:text-[#12d6fa] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12d6fa] focus-visible:ring-offset-2 ${isRTL ? "right-6" : "left-6"}`}
      aria-label={isRTL ? "رجوع" : "Back"}
    >
      <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
    </button>
  )
}
