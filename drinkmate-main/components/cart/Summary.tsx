'use client'

import { Currency } from '@/utils/currency'
import { useCart } from '@/hooks/use-cart'
import { useCartSettings } from '@/lib/contexts/cart-settings-context'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/contexts/translation-context'

interface CartTotals {
  subtotal: number
  shipping: number | null
  discount: number
  tax: number
  total: number
  shippingLabel: string | React.ReactNode
}

interface SummaryProps {
  totals: CartTotals
}

export default function Summary({ totals }: SummaryProps) {
  const { getText } = useCartSettings()
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const router = useRouter()
  const { t, isRTL } = useTranslation()

  const handleApplyCoupon = async () => {
    if (!code.trim()) {
      toast.error(t('cart.coupon.enter'))
      return
    }

    setIsApplying(true)
    try {
      // TODO: Implement coupon functionality
      toast.success(t('cart.coupon.applied'))
      setCode('')
    } catch (error) {
      toast.error(t('cart.coupon.invalid'))
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="bg-white rounded-soft shadow-card p-5 sticky top-24">
      <div className="space-y-3">
        <Row label={getText(isRTL ? 'general.subtotalAr' : 'general.subtotalEn')} value={<Currency amount={totals.subtotal} />} />
        <Row label={getText(isRTL ? 'general.shippingAr' : 'general.shippingEn')} value={totals.shippingLabel} />
        {totals.discount > 0 && (
          <Row 
            label={getText(isRTL ? 'general.discountAr' : 'general.discountEn')} 
            value={<span className="text-green-700">– <Currency amount={totals.discount} /></span>} 
          />
        )}
        {totals.tax > 0 && <Row label={getText(isRTL ? 'general.taxAr' : 'general.taxEn')} value={<Currency amount={totals.tax} />} />}
      </div>

      <div className="mt-4 border-t border-ink-200 pt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-ink-900">{getText(isRTL ? 'general.totalAr' : 'general.totalEn')}</span>
        <span className="text-2xl font-bold text-ink-900">
          <Currency amount={totals.total} size="lg" />
        </span>
      </div>

      {/* Coupon */}
      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            placeholder={getText(isRTL ? 'general.couponPlaceholderAr' : 'general.couponPlaceholderEn')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 h-11 rounded-md border border-ink-200 focus:ring-2 focus:ring-brand/30 focus:border-brand px-3"
            disabled={isApplying}
          />
          <button
            disabled={!code.trim() || isApplying}
            onClick={handleApplyCoupon}
            className="h-11 px-4 rounded-md bg-ink-900 text-white disabled:opacity-50"
          >
            {isApplying ? '...' : getText(isRTL ? 'general.applyCouponAr' : 'general.applyCouponEn')}
          </button>
        </div>
        
      </div>

      <button 
        onClick={() => router.push('/checkout')}
        className="mt-4 w-full h-12 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
      >
        {getText(isRTL ? 'general.secureCheckoutAr' : 'general.secureCheckoutEn')}
      </button>

      <p className="mt-2 text-xs text-ink-500">{t('cart.taxesNote')}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-700">{label}</span>
      <span className="text-ink-900">{value}</span>
    </div>
  )
}
