'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/contexts/translation-context'
import { useAuth } from '@/lib/contexts/auth-context'
import { Subscription } from '@/types/account'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Pause, Play, SkipForward, Edit, Trash2, Calendar, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Price } from '@/components/account/Price'
import { toast } from 'sonner'

export default function SubscriptionsPage() {
  const { language, isRTL } = useTranslation()
  const { isAuthenticated, token } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/user/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.subscriptions) {
            setSubscriptions(result.subscriptions.map((sub: any) => ({
              id: sub.id,
              productId: sub.productId,
              productName: sub.productName,
              variant: sub.variant,
              quantity: sub.quantity,
              nextChargeAt: sub.nextChargeAt,
              interval: sub.interval,
              status: sub.status,
              createdAt: sub.createdAt
            })))
          } else {
            setSubscriptions([])
          }
        } else {
          console.error('Failed to fetch subscriptions:', response.status)
          setSubscriptions([])
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
        setSubscriptions([])
        toast.error(language === 'AR' ? 'فشل تحميل الاشتراكات' : 'Failed to load subscriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [isAuthenticated, token, language])

  const getStatusLabel = (status: string) => {
    const statusMap = {
      active: { en: 'Active', ar: 'نشط' },
      paused: { en: 'Paused', ar: 'معلق' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' }
    }
    return statusMap[status as keyof typeof statusMap] || { en: status, ar: status }
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-amber-100 text-amber-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const getIntervalLabel = (interval: string) => {
    const intervalMap = {
      '4w': { en: 'Every 4 weeks', ar: 'كل 4 أسابيع' },
      '8w': { en: 'Every 8 weeks', ar: 'كل 8 أسابيع' },
      '12w': { en: 'Every 12 weeks', ar: 'كل 12 أسبوع' }
    }
    return intervalMap[interval as keyof typeof intervalMap] || { en: interval, ar: interval }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'AR' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePause = async (id: string) => {
    if (!token) {
      toast.error(language === 'AR' ? 'غير مصرح' : 'Not authenticated')
      return
    }

    try {
      const response = await fetch(`/api/user/subscriptions/${id}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSubscriptions(prev => prev.map(sub => 
            sub.id === id ? { ...sub, status: 'paused' as const } : sub
          ))
          toast.success(language === 'AR' ? 'تم إيقاف الاشتراك' : 'Subscription paused')
        } else {
          toast.error(result.error || (language === 'AR' ? 'فشل إيقاف الاشتراك' : 'Failed to pause subscription'))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || (language === 'AR' ? 'فشل إيقاف الاشتراك' : 'Failed to pause subscription'))
      }
    } catch (error) {
      console.error('Error pausing subscription:', error)
      toast.error(language === 'AR' ? 'فشل إيقاف الاشتراك' : 'Failed to pause subscription')
    }
  }

  const handleResume = async (id: string) => {
    if (!token) {
      toast.error(language === 'AR' ? 'غير مصرح' : 'Not authenticated')
      return
    }

    try {
      const response = await fetch(`/api/user/subscriptions/${id}/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSubscriptions(prev => prev.map(sub => 
            sub.id === id ? { ...sub, status: 'active' as const } : sub
          ))
          toast.success(language === 'AR' ? 'تم استئناف الاشتراك' : 'Subscription resumed')
        } else {
          toast.error(result.error || (language === 'AR' ? 'فشل استئناف الاشتراك' : 'Failed to resume subscription'))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || (language === 'AR' ? 'فشل استئناف الاشتراك' : 'Failed to resume subscription'))
      }
    } catch (error) {
      console.error('Error resuming subscription:', error)
      toast.error(language === 'AR' ? 'فشل استئناف الاشتراك' : 'Failed to resume subscription')
    }
  }

  const handleSkip = async (id: string) => {
    if (!token) {
      toast.error(language === 'AR' ? 'غير مصرح' : 'Not authenticated')
      return
    }

    try {
      const response = await fetch(`/api/user/subscriptions/${id}/skip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh subscriptions to get updated nextChargeAt
          const fetchResponse = await fetch('/api/user/subscriptions', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          if (fetchResponse.ok) {
            const fetchResult = await fetchResponse.json()
            if (fetchResult.success && fetchResult.subscriptions) {
              setSubscriptions(fetchResult.subscriptions.map((sub: any) => ({
                id: sub.id,
                productId: sub.productId,
                productName: sub.productName,
                variant: sub.variant,
                quantity: sub.quantity,
                nextChargeAt: sub.nextChargeAt,
                interval: sub.interval,
                status: sub.status,
                createdAt: sub.createdAt
              })))
            }
          }
          toast.success(language === 'AR' ? 'تم تخطي التوصيل التالي' : 'Next delivery skipped')
        } else {
          toast.error(result.error || (language === 'AR' ? 'فشل تخطي التوصيل' : 'Failed to skip delivery'))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || (language === 'AR' ? 'فشل تخطي التوصيل' : 'Failed to skip delivery'))
      }
    } catch (error) {
      console.error('Error skipping delivery:', error)
      toast.error(language === 'AR' ? 'فشل تخطي التوصيل' : 'Failed to skip delivery')
    }
  }

  const handleEdit = async (id: string) => {
    // TODO: Open edit modal/dialog
    console.log('Edit subscription:', id)
    toast.info(language === 'AR' ? 'قريباً' : 'Coming soon')
  }

  const handleCancel = async (id: string) => {
    if (!window.confirm(language === 'AR' ? 'هل أنت متأكد من إلغاء هذا الاشتراك؟' : 'Are you sure you want to cancel this subscription?')) {
      return
    }

    if (!token) {
      toast.error(language === 'AR' ? 'غير مصرح' : 'Not authenticated')
      return
    }

    try {
      const response = await fetch(`/api/user/subscriptions/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSubscriptions(prev => prev.filter(sub => sub.id !== id))
          toast.success(language === 'AR' ? 'تم إلغاء الاشتراك' : 'Subscription cancelled')
        } else {
          toast.error(result.error || (language === 'AR' ? 'فشل إلغاء الاشتراك' : 'Failed to cancel subscription'))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || (language === 'AR' ? 'فشل إلغاء الاشتراك' : 'Failed to cancel subscription'))
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      toast.error(language === 'AR' ? 'فشل إلغاء الاشتراك' : 'Failed to cancel subscription')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'AR' ? 'الاشتراكات' : 'Subscriptions'}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'AR' 
            ? 'إدارة اشتراكاتك التلقائية'
            : 'Manage your automatic subscriptions'
          }
        </p>
      </div>

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'AR' ? 'لا توجد اشتراكات' : 'No subscriptions yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'AR' 
              ? 'وفر 10% مع الاشتراك التلقائي'
              : 'Save 10% with automatic subscriptions'
            }
          </p>
          <Button>
            {language === 'AR' ? 'تعرف على المزيد' : 'Learn More'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {subscription.productName}
                    </h3>
                    {subscription.variant && (
                      <span className="text-sm text-gray-500">
                        ({subscription.variant})
                      </span>
                    )}
                    <Badge className={getStatusColor(subscription.status)}>
                      {getStatusLabel(subscription.status)[language.toLowerCase() as 'en' | 'ar']}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {subscription.quantity} {language === 'AR' ? 'قطعة' : 'items'}
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" />
                      {getIntervalLabel(subscription.interval)[language.toLowerCase() as 'en' | 'ar']}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {language === 'AR' ? 'الدفعة التالية:' : 'Next charge:'}
                  </div>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(subscription.nextChargeAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {subscription.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePause(subscription.id)}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      {language === 'AR' ? 'إيقاف مؤقت' : 'Pause'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkip(subscription.id)}
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      {language === 'AR' ? 'تخطي التالي' : 'Skip Next'}
                    </Button>
                  </>
                )}
                
                {subscription.status === 'paused' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResume(subscription.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {language === 'AR' ? 'استئناف' : 'Resume'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(subscription.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {language === 'AR' ? 'تعديل' : 'Edit'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(subscription.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {language === 'AR' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
