"use client"

import { useEffect } from 'react'
import { useTranslation } from '@/lib/contexts/translation-context'

export default function FontProvider() {
  const { language, isRTL } = useTranslation()

  useEffect(() => {
    // Update HTML attributes based on language
    const html = document.documentElement
    html.setAttribute('lang', language === 'AR' ? 'ar' : 'en')
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    
    // Update CSS custom properties for font switching with proper fallbacks
    const root = document.documentElement
    // Use RH ZAK for both languages
    root.style.setProperty('--font-primary', 'var(--font-rh-zak), "RH ZAK", system-ui, sans-serif')
    root.style.setProperty('--font-secondary', 'var(--font-rh-zak), "RH ZAK", system-ui, sans-serif')
  }, [language, isRTL])

  return null
}
