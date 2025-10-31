"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Banner from "./Banner"
import Header from "./Header"
import Footer from "./Footer"
import { useTranslation } from "@/lib/contexts/translation-context"
import { toast } from "sonner"

interface PageLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function PageLayout({ children, currentPage }: PageLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isRTL, isHydrated, setLanguage } = useTranslation()
  
  // Handle session expiration
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error("Your session has expired. Please log in again.")
      router.push('/login?session=expired')
    }
    
    window.addEventListener('session-expired', handleSessionExpired)
    
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired)
    }
  }, [router])

  // Auto-switch language based on route prefix (e.g., "/ar")
  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/ar')) {
      setLanguage('AR')
    } else {
      setLanguage('EN')
    }
  }, [pathname, setLanguage])
  
  return (
    <div 
      className={`min-h-screen bg-white font-primary`}
      dir={isHydrated && isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <Banner />
      <Header currentPage={currentPage} />
      <main className={`max-w-[1920px] mx-auto`} suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </div>
  )
}
