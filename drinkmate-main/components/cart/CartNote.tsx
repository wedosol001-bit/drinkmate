'use client'

import { useCart } from '@/hooks/use-cart'
import { useCartSettings } from '@/lib/contexts/cart-settings-context'
import { useTranslation } from '@/lib/contexts/translation-context'
import { useEffect, useState } from 'react'

export default function CartNote() {
  const { setNote } = useCart()
  const { getText } = useCartSettings()
  const [value, setValue] = useState('')
  const { isRTL } = useTranslation()

  useEffect(() => {
    const t = setTimeout(() => setNote(value), 500)
    return () => clearTimeout(t)
  }, [value, setNote])

  return (
    <section className="bg-white rounded-soft shadow-card p-5">
      <label className="block text-sm font-medium text-ink-800">
        {getText(isRTL ? 'general.noteLabelAr' : 'general.noteLabelEn')}
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={300}
        rows={4}
        className="mt-2 w-full rounded-md border border-ink-200 focus:ring-2 focus:ring-brand/30 focus:border-brand"
        placeholder={getText(isRTL ? 'general.notePlaceholderAr' : 'general.notePlaceholderEn')}
      />
      <div className="mt-1 text-xs text-ink-500">{value.length}/300</div>
    </section>
  )
}
