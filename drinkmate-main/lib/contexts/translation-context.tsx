"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { translations, Language } from '../translations'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  isHydrated: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

interface TranslationProviderProps {
  children: ReactNode
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Initialize with default language to prevent hydration mismatch
  const [language, setLanguage] = useState<Language>('EN')
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize language from localStorage after hydration
  useEffect(() => {
    // Use requestAnimationFrame to ensure this runs after the initial render
    const timer = requestAnimationFrame(() => {
      const saved = localStorage.getItem('drinkmate-language')
      if (saved === 'EN' || saved === 'AR') {
        setLanguage(saved)
      }
      setIsHydrated(true)
    })
    
    return () => cancelAnimationFrame(timer)
  }, [])

  const isRTL = language === 'AR'

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('drinkmate-language', language)
    }
  }, [language, isHydrated])

  const t = (key: string): string => {
    const keys = key.split('.')

    // Try current language first
    let current: any = translations[language]
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        current = undefined
        break
      }
    }
    if (typeof current === 'string') return current

    // Fallback to English if missing in current language
    let fallback: any = translations.EN
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) {
        fallback = fallback[k]
      } else {
        fallback = undefined
        break
      }
    }
    if (typeof fallback === 'string') return fallback

    // Final fallback: return empty string to avoid exposing keys in UI
    return ''
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL, isHydrated }}>
      {children}
    </TranslationContext.Provider>
  )
}
