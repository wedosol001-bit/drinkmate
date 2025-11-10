'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/contexts/translation-context'
import { Order, Invoice } from '@/types/account'
import { orderAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  FileText, 
  RotateCcw, 
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  MapPin,
  MessageCircle,
  Copy,
  ExternalLink,
  Loader2,
  TrendingUp,
  Eye,
  X,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Price } from '@/components/account/Price'
import { toast } from 'sonner'

// Enhanced types for better tracking data
interface TrackingCheckpoint {
  ts: string
  status: string
  city?: string
  message: string
  location?: string
}

interface Carrier {
  name: string
  code: string
  trackingNumber: string
  trackingUrl: string
  logo?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language, isRTL } = useTranslation()
  const [order, setOrder] = useState<Order | null>(null)
  const [backendOrder, setBackendOrder] = useState<any>(null) // Store full backend order for additional data
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<string>('pending')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Transform backend order to frontend Order type
  const transformBackendOrder = (backendOrder: any): Order => {
    // Map line items from backend items
    const lineItems = backendOrder.items?.map((item: any, index: number) => ({
      id: item._id || item.id || String(index),
      productId: item.product?._id || item.product || item.productId || '',
      productName: item.name || 'Unknown Product',
      variant: item.color || item.variant || undefined,
      quantity: item.quantity || 1,
      price: item.price || 0,
      image: item.image || '/images/placeholder-product.jpg'
    })) || []

    // Map shipments from backend shipping data
    const shipments = []
    if (backendOrder.shipping?.aramexWaybillNumber || backendOrder.trackingNumber) {
      shipments.push({
        id: '1',
        trackingNumber: backendOrder.shipping?.aramexWaybillNumber || backendOrder.trackingNumber,
        carrier: backendOrder.shipping?.method || 'Aramex',
        status: mapShippingStatus(backendOrder.shipping?.status || backendOrder.status),
        estimatedDelivery: backendOrder.shipping?.estimatedDelivery 
          ? new Date(backendOrder.shipping.estimatedDelivery).toISOString()
          : backendOrder.estimatedDeliveryDate 
          ? new Date(backendOrder.estimatedDeliveryDate).toISOString()
          : undefined,
        actualDelivery: backendOrder.shipping?.deliveredAt
          ? new Date(backendOrder.shipping.deliveredAt).toISOString()
          : undefined
      })
    }

    // Map invoices (if available)
    const invoices: Invoice[] = []
    if (backendOrder.orderNumber) {
      invoices.push({
        id: backendOrder._id || backendOrder.id,
        number: `INV-${backendOrder.orderNumber}`,
        url: `/api/invoices/${backendOrder._id || backendOrder.id}`,
        createdAt: backendOrder.createdAt || new Date().toISOString()
      })
    }

    return {
      id: backendOrder._id || backendOrder.id,
      number: backendOrder.orderNumber || backendOrder.order_number || backendOrder.id || 'N/A',
      createdAt: backendOrder.createdAt || new Date().toISOString(),
      status: mapOrderStatus(backendOrder.status || 'pending'),
      total: typeof backendOrder.total === 'number' ? backendOrder.total : (backendOrder.totalAmount || 0),
      itemsCount: backendOrder.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0,
      items: backendOrder.items?.map((item: any) => ({
        name: item.name || 'Unknown Item',
        quantity: item.quantity || 1,
        price: item.price || 0
      })) || [],
      trackingNumber: backendOrder.shipping?.aramexWaybillNumber || backendOrder.trackingNumber || null,
      estimatedDelivery: backendOrder.shipping?.estimatedDelivery 
        ? new Date(backendOrder.shipping.estimatedDelivery).toISOString()
        : backendOrder.estimatedDeliveryDate 
        ? new Date(backendOrder.estimatedDeliveryDate).toISOString()
        : null,
      lineItems,
      shipments,
      invoices
    }
  }

  // Map backend status to frontend OrderStatus
  // Note: Frontend OrderStatus type only supports: processing, shipped, delivered, cancelled, returned
  // Backend supports: pending, confirmed, processing, shipped, delivered, cancelled, returned, refunded
  const mapOrderStatus = (status: string): Order['status'] => {
    const statusMap: Record<string, Order['status']> = {
      'pending': 'processing',      // Map pending to processing for display
      'confirmed': 'processing',    // Map confirmed to processing for display
      'processing': 'processing',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'returned': 'returned',
      'refunded': 'cancelled'       // Map refunded to cancelled for display (similar visual state)
    }
    return statusMap[status.toLowerCase()] || 'processing'
  }

  // Map shipping status
  const mapShippingStatus = (status: string): 'pending' | 'in_transit' | 'delivered' => {
    const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered'> = {
      'pending': 'pending',
      'shipped': 'in_transit',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'exception': 'pending'
    }
    return statusMap[status?.toLowerCase() || 'pending'] || 'pending'
  }

  // Build tracking checkpoints from backend data
  const buildTrackingCheckpoints = (backendOrder: any): TrackingCheckpoint[] => {
    const checkpoints: TrackingCheckpoint[] = []

    // Add timeline entries if available (from order timeline)
    if (backendOrder.timeline && Array.isArray(backendOrder.timeline) && backendOrder.timeline.length > 0) {
      backendOrder.timeline.forEach((entry: any) => {
        checkpoints.push({
          ts: entry.timestamp || new Date().toISOString(),
          status: entry.status?.toUpperCase() || 'PROCESSING',
          message: entry.description || `Order ${entry.status}`,
          location: backendOrder.shippingAddress?.city || ''
        })
      })
    }

    // Add shipping tracking history if available (from Aramex or other carriers)
    if (backendOrder.shipping?.trackingHistory && Array.isArray(backendOrder.shipping.trackingHistory) && backendOrder.shipping.trackingHistory.length > 0) {
      backendOrder.shipping.trackingHistory.forEach((track: any) => {
        checkpoints.push({
          ts: track.updateDateTime || new Date().toISOString(),
          status: track.updateCode?.toUpperCase() || 'IN_TRANSIT',
          city: track.updateLocation || '',
          message: track.updateDescription || track.comments || 'Package update',
          location: track.updateLocation || ''
        })
      })
    }

    // If no checkpoints from tracking data, create basic ones from order status
    // This ensures the timeline always shows something, even without tracking integration
    if (checkpoints.length === 0) {
      const orderDate = backendOrder.createdAt ? new Date(backendOrder.createdAt) : new Date()
      const status = backendOrder.status?.toLowerCase() || 'pending'
      
      // Always show order placed
      checkpoints.push({
        ts: orderDate.toISOString(),
      status: 'PROCESSING',
        message: language === 'AR' ? 'تم استلام الطلب' : 'Order received and being prepared',
        location: backendOrder.shippingAddress?.city || backendOrder.shippingAddress?.district || ''
      })

      // Show confirmed status if order is past pending
      if (['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(status)) {
        const confirmedDate = new Date(orderDate)
        confirmedDate.setHours(confirmedDate.getHours() + 2) // Assume confirmed 2 hours after order
        checkpoints.push({
          ts: confirmedDate.toISOString(),
          status: 'PROCESSING',
          message: language === 'AR' ? 'تم تأكيد الطلب' : 'Order confirmed',
          location: backendOrder.shippingAddress?.city || ''
        })
      }

      // Show processing/packed if order is processing or shipped
      if (['processing', 'shipped', 'delivered'].includes(status)) {
        const processingDate = backendOrder.shipping?.shippedAt 
          ? new Date(backendOrder.shipping.shippedAt)
          : new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) // 1 day after order
        checkpoints.push({
          ts: processingDate.toISOString(),
          status: 'PROCESSING',
          message: language === 'AR' ? 'جاري تجهيز الطلب' : 'Order being prepared',
          location: backendOrder.shippingAddress?.city || ''
        })
      }

      // Show shipped if order is shipped or delivered
      if (['shipped', 'delivered'].includes(status)) {
        const shippedDate = backendOrder.shipping?.shippedAt 
          ? new Date(backendOrder.shipping.shippedAt)
          : backendOrder.updatedAt 
          ? new Date(backendOrder.updatedAt)
          : new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days after order
        checkpoints.push({
          ts: shippedDate.toISOString(),
          status: 'SHIPPED',
          message: language === 'AR' ? 'تم شحن الطلب' : 'Package dispatched',
          location: backendOrder.shippingAddress?.city || ''
        })
      }

      // Show OUT_FOR_DELIVERY if shipped (this is the current status when shipped)
      if (status === 'shipped') {
        const outForDeliveryDate = backendOrder.shipping?.shippedAt 
          ? new Date(new Date(backendOrder.shipping.shippedAt).getTime() + 12 * 60 * 60 * 1000)
          : backendOrder.updatedAt 
          ? new Date(backendOrder.updatedAt)
          : new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        checkpoints.push({
          ts: outForDeliveryDate.toISOString(),
          status: 'OUT_FOR_DELIVERY',
          message: language === 'AR' ? 'الطلب جاهز للتسليم' : 'Package out for delivery',
          location: backendOrder.shippingAddress?.city || ''
        })
      }

      // Show delivered if order is delivered
      if (status === 'delivered') {
        const deliveredDate = backendOrder.shipping?.deliveredAt 
          ? new Date(backendOrder.shipping.deliveredAt)
          : backendOrder.updatedAt 
          ? new Date(backendOrder.updatedAt)
          : new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days after order
        checkpoints.push({
          ts: deliveredDate.toISOString(),
          status: 'DELIVERED',
          message: language === 'AR' ? 'تم تسليم الطلب بنجاح' : 'Package delivered successfully',
          location: backendOrder.shippingAddress?.city || ''
        })
      }

      // Show cancelled/refunded status if applicable
      if (['cancelled', 'refunded'].includes(status)) {
        const cancelledDate = backendOrder.updatedAt 
          ? new Date(backendOrder.updatedAt)
          : new Date(orderDate.getTime() + 1 * 24 * 60 * 60 * 1000)
        checkpoints.push({
          ts: cancelledDate.toISOString(),
          status: status === 'refunded' ? 'CANCELLED' : 'CANCELLED',
          message: status === 'refunded' 
            ? (language === 'AR' ? 'تم استرداد الطلب' : 'Order refunded')
            : (language === 'AR' ? 'تم إلغاء الطلب' : 'Order cancelled'),
          location: backendOrder.shippingAddress?.city || ''
        })
      }
    }

    // Sort by timestamp (newest first)
    return checkpoints.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
  }

  // Get carrier information from backend order
  const getCarrierInfo = (backendOrder: any): Carrier => {
    const waybillNumber = backendOrder.shipping?.aramexWaybillNumber || backendOrder.trackingNumber
    const carrierName = backendOrder.shipping?.method || 'Aramex'
    
    return {
      name: carrierName,
      code: carrierName.toLowerCase().replace(/\s+/g, '_'),
      trackingNumber: waybillNumber || '',
      trackingUrl: backendOrder.shipping?.trackingUrl || 
        (waybillNumber ? `https://www.aramex.com/track/${waybillNumber}` : ''),
      logo: undefined
    }
  }

  // Fetch order from API
    const fetchOrder = async () => {
    try {
      setLoading(true)
      const orderId = params.id as string

      // Try to fetch order by ID (could be MongoDB _id or orderNumber)
      // The backend getOrder function uses findById, so it expects MongoDB ObjectId
      // If the ID format doesn't match ObjectId, we'll get an error and handle it
      const response = await orderAPI.getOrder(orderId)

      if (response.success && response.order) {
        const transformedOrder = transformBackendOrder(response.order)
        setOrder(transformedOrder)
        setBackendOrder(response.order)
        setPaymentStatus(response.order.paymentDetails?.paymentStatus || response.order.paymentStatus || 'pending')
      } else if (response.success && response.data) {
        // Handle case where order is in data property
        const transformedOrder = transformBackendOrder(response.data)
        setOrder(transformedOrder)
        setBackendOrder(response.data)
        setPaymentStatus(response.data.paymentDetails?.paymentStatus || response.data.paymentStatus || 'pending')
      } else {
        toast.error(
          language === 'AR' 
            ? 'لم يتم العثور على الطلب' 
            : 'Order not found'
        )
        router.push('/account/orders')
      }
    } catch (error: any) {
      console.error('Error fetching order:', error)
      toast.error(
        language === 'AR' 
          ? 'حدث خطأ أثناء تحميل تفاصيل الطلب' 
          : 'Failed to load order details'
      )
      
      // If order not found, redirect to orders list
      if (error?.response?.status === 404 || error?.message?.includes('not found')) {
        router.push('/account/orders')
      }
    } finally {
      setLoading(false)
    }
    }

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    fetchOrder()

    // Poll for updates every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchOrder()
    }, 30000)

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [params.id])

  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: { en: 'Pending', ar: 'معلق' },
      confirmed: { en: 'Confirmed', ar: 'مؤكد' },
      processing: { en: 'Processing', ar: 'قيد المعالجة' },
      shipped: { en: 'Shipped', ar: 'تم الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' },
      returned: { en: 'Returned', ar: 'مرتجع' },
      refunded: { en: 'Refunded', ar: 'مسترد' }
    }
    return statusMap[status.toLowerCase() as keyof typeof statusMap] || { en: status, ar: status }
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-amber-100 text-amber-800 border-amber-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      returned: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colorMap[status.toLowerCase() as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status: string) => {
    const iconMap = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      processing: <RefreshCw className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <X className="h-4 w-4" />,
      returned: <RotateCcw className="h-4 w-4" />,
      refunded: <RotateCcw className="h-4 w-4" />
    }
    return iconMap[status.toLowerCase() as keyof typeof iconMap] || <Clock className="h-4 w-4" />
  }

  const getShipmentStatusLabel = (status: string) => {
    const statusMap = {
      pending: { en: 'Pending', ar: 'معلق' },
      in_transit: { en: 'In Transit', ar: 'في الطريق' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' }
    }
    return statusMap[status as keyof typeof statusMap] || { en: status, ar: status }
  }

  const getTrackingStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'OUT_FOR_DELIVERY': return <Truck className="w-4 h-4 text-blue-600" />
      case 'IN_TRANSIT': return <Truck className="w-4 h-4 text-blue-500" />
      case 'SHIPPED': return <Package className="w-4 h-4 text-blue-600" />
      case 'PROCESSING': return <Package className="w-4 h-4 text-yellow-600" />
      case 'RECEIVED': return <Package className="w-4 h-4 text-gray-600" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const formatLastUpdated = (lastUpdated: string) => {
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
    return `${Math.floor(diffMinutes / 1440)} days ago`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'AR' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Removed handleReorder function - reorder button has been removed

  const handleReturn = () => {
    // Redirect to contact page for returns
    router.push('/contact?subject=return&order=' + order?.number)
  }

  // Removed handleContactSupport - now using Link component directly

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // Try to fetch invoice from API endpoint if URL is provided
      if (invoice.url && invoice.url.startsWith('/api/')) {
        try {
          const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
          const response = await fetch(invoice.url, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            }
          })

          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${invoice.number}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            toast.success(
        language === 'AR' 
                ? `تم تحميل الفاتورة ${invoice.number}` 
                : `Downloaded invoice ${invoice.number}`
            )
            return
          }
        } catch (apiError) {
          console.error('Error fetching invoice from API:', apiError)
        }
      }

      // Fallback: Generate a proper invoice text file
      const invoiceContent = `
INVOICE
${invoice.number}

Order Number: ${order?.number || 'N/A'}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Amount: ${order?.total || 0} SAR

Order Details:
${order?.lineItems?.map(item => `- ${item.productName} x${item.quantity} = ${item.price * item.quantity} SAR`).join('\n') || 'No items'}

Subtotal: ${backendOrder?.subtotal || 0} SAR
Shipping: ${backendOrder?.shippingCost || 0} SAR
Tax: ${backendOrder?.tax || 0} SAR
Total: ${order?.total || 0} SAR

Payment Method: ${backendOrder?.paymentMethod || 'N/A'}
Payment Status: ${paymentStatus}

Shipping Address:
${backendOrder?.shippingAddress?.fullName || ''}
${backendOrder?.shippingAddress?.nationalAddress || ''}
${backendOrder?.shippingAddress?.city || ''}, ${backendOrder?.shippingAddress?.country || 'Saudi Arabia'}

Thank you for your order!
      `.trim()

      // Create a proper text file (can be opened by PDF readers or text editors)
      const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.number}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(
        language === 'AR' 
          ? `تم تحميل الفاتورة ${invoice.number}` 
          : `Downloaded invoice ${invoice.number}`
      )
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error(
        language === 'AR' 
          ? 'حدث خطأ أثناء تحميل الفاتورة' 
          : 'Error downloading invoice'
      )
    }
  }

  // Progress bar component
  function ProgressBar({ status, checkpoints }: { status: string, checkpoints: TrackingCheckpoint[] }) {
    const statusSteps = [
      { key: 'RECEIVED', label: 'Received', icon: Package },
      { key: 'PROCESSING', label: 'Processing', icon: Clock },
      { key: 'PACKED', label: 'Packed', icon: Package },
      { key: 'SHIPPED', label: 'Shipped', icon: Truck },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
      { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
    ]

    // Map order status to checkpoint status for progress bar
    // When order status is "shipped", show "OUT_FOR_DELIVERY" as current step
    let currentStatus = status
    if (status === 'SHIPPED' || status === 'shipped') {
      // Check if we have OUT_FOR_DELIVERY checkpoint, if so use that
      const hasOutForDelivery = checkpoints.some(cp => cp.status === 'OUT_FOR_DELIVERY')
      if (hasOutForDelivery) {
        currentStatus = 'OUT_FOR_DELIVERY'
      } else {
        // If no OUT_FOR_DELIVERY checkpoint yet, use SHIPPED
        currentStatus = 'SHIPPED'
      }
    }

    const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus)
    const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / statusSteps.length) * 100 : 0

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {language === 'AR' ? 'تقدم الطلب' : 'Order Progress'}
          </span>
          <span className="text-gray-500">{Math.round(progress)}% {language === 'AR' ? 'مكتمل' : 'Complete'}</span>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500",
                    isCurrent && "ring-4 ring-blue-200"
                  )}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-xs mt-1 text-center max-w-16",
                    isActive ? "text-blue-600 font-medium" : "text-gray-500"
                  )}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Timeline component
  function Timeline({ checkpoints }: { checkpoints: TrackingCheckpoint[] }) {
    const formatTimestamp = (ts: string) => {
      const date = new Date(ts)
      return date.toLocaleString(language === 'AR' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-lg">
          {language === 'AR' ? 'جدول التتبع' : 'Tracking Timeline'}
        </h3>
        <div className="space-y-3">
          {checkpoints.map((checkpoint, index) => (
            <div key={index} className={cn(
              "flex gap-3 p-4 rounded-lg border",
              index === 0 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
            )}>
              <div className="flex-shrink-0 mt-0.5">
                {getTrackingStatusIcon(checkpoint.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {checkpoint.message}
                    </p>
                    {checkpoint.city && (
                      <p className="text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {checkpoint.city}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTimestamp(checkpoint.ts)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">
                {language === 'AR' ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'AR' ? 'الطلب غير موجود' : 'Order not found'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {language === 'AR' 
                ? 'لم يتم العثور على الطلب المطلوب'
                : 'The requested order could not be found'
              }
            </p>
            <Link href="/account/orders">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'AR' ? 'العودة للطلبات' : 'Back to Orders'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/account/orders">
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                <ArrowLeft className={cn(
                  "w-4 h-4 mr-2",
                  isRTL ? "ml-2 mr-0 rotate-180" : ""
                )} />
                {language === 'AR' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {order.number}
              </h1>
              <p className="text-gray-600 text-lg">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge className={cn(
              "px-4 py-2 text-sm font-medium border",
              getStatusColor(backendOrder?.status || order.status)
            )}>
              <span className="flex items-center gap-2">
                {getStatusIcon(backendOrder?.status || order.status)}
                {/* Display the actual backend status label, not the mapped one */}
                {getStatusLabel(backendOrder?.status || order.status)[language.toLowerCase() as 'en' | 'ar']}
              </span>
            </Badge>
          </div>
        </div>

        {/* Status Header with Progress */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              {language === 'AR' ? 'حالة الطلب' : 'Order Status'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {backendOrder && (() => {
              const checkpoints = buildTrackingCheckpoints(backendOrder)
              // Determine the current status for progress bar
              // If order is shipped and we have OUT_FOR_DELIVERY checkpoint, use that
              let progressStatus = order.status.toUpperCase()
              if (order.status === 'shipped') {
                const hasOutForDelivery = checkpoints.some(cp => cp.status === 'OUT_FOR_DELIVERY')
                if (hasOutForDelivery) {
                  progressStatus = 'OUT_FOR_DELIVERY'
                }
              }
              return (
                <ProgressBar 
                  status={progressStatus} 
                  checkpoints={checkpoints} 
                />
              )
            })()}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  {language === 'AR' ? 'عناصر الطلب' : 'Order Items'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {order.lineItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {item.productName}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600 mb-1">
                            {language === 'AR' ? 'المتغير:' : 'Variant:'} {item.variant}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {language === 'AR' ? 'الكمية:' : 'Quantity:'} {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <Price value={item.price} size="lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipment Tracking */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  {language === 'AR' ? 'تتبع الشحن' : 'Shipment Tracking'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Carrier Information */}
                  {backendOrder && (() => {
                    const carrier = getCarrierInfo(backendOrder)
                    return (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                                {carrier.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {language === 'AR' ? 'شركة الشحن' : 'Shipping Carrier'}
                          </p>
                        </div>
                      </div>
                          {carrier.trackingUrl && (
                      <Button
                        variant="outline"
                              onClick={() => window.open(carrier.trackingUrl, '_blank')}
                        className="hover:bg-blue-50 hover:border-blue-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === 'AR' ? 'تتبع' : 'Track'}
                      </Button>
                          )}
                    </div>
                    
                    <div className="space-y-3">
                          {carrier.trackingNumber ? (
                            <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {language === 'AR' ? 'رقم التتبع:' : 'Tracking Number:'}
                        </span>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-3 py-1 rounded-lg text-sm font-mono border">
                                    {carrier.trackingNumber}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                                    onClick={() => copyToClipboard(carrier.trackingNumber)}
                            className="hover:bg-blue-100"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                              {backendOrder.updatedAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {language === 'AR' ? 'آخر تحديث:' : 'Last Updated:'}
                          </span>
                          <span className="text-sm text-gray-600">
                                    {formatLastUpdated(backendOrder.updatedAt)}
                          </span>
                        </div>
                      )}
                            </>
                          ) : (
                            <div className="bg-white/60 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {language === 'AR' ? 'رقم التتبع غير متاح بعد' : 'Tracking number not available yet'}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {language === 'AR' 
                                      ? 'سيتم إضافة رقم التتبع تلقائياً عند شحن الطلب'
                                      : 'Tracking number will be added automatically when order is shipped'}
                                  </p>
                    </div>
                  </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Timeline - Always show, even without tracking integration */}
                  {backendOrder && (
                    <Timeline checkpoints={buildTrackingCheckpoints(backendOrder)} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  {language === 'AR' ? 'ملخص الطلب' : 'Order Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {backendOrder && (
                    <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'AR' ? 'المجموع الفرعي:' : 'Subtotal:'}
                    </span>
                        <Price value={backendOrder.subtotal || 0} size="sm" />
                  </div>
                      {backendOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                            {language === 'AR' ? 'الخصم:' : 'Discount:'}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                            -<Price value={backendOrder.discount} size="sm" />
                    </span>
                  </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'AR' ? 'الشحن:' : 'Shipping:'}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          (backendOrder.shippingCost || 0) === 0 ? "text-green-600" : "text-gray-900"
                        )}>
                          {(backendOrder.shippingCost || 0) === 0 
                            ? (language === 'AR' ? 'مجاني' : 'Free')
                            : <Price value={backendOrder.shippingCost || 0} size="sm" />
                          }
                        </span>
                      </div>
                      {backendOrder.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'AR' ? 'الضريبة:' : 'Tax:'}
                          </span>
                          <Price value={backendOrder.tax || 0} size="sm" />
                        </div>
                      )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{language === 'AR' ? 'المجموع:' : 'Total:'}</span>
                      <Price value={order.total} size="lg" />
                    </div>
                  </div>
                      {/* Payment Status */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'AR' ? 'حالة الدفع:' : 'Payment Status:'}
                          </span>
                          <Badge 
                            variant={paymentStatus === 'paid' ? 'default' : paymentStatus === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            {paymentStatus === 'paid' 
                              ? (language === 'AR' ? 'مدفوع' : 'Paid')
                              : paymentStatus === 'pending'
                              ? (language === 'AR' ? 'معلق' : 'Pending')
                              : paymentStatus === 'failed'
                              ? (language === 'AR' ? 'فشل' : 'Failed')
                              : paymentStatus === 'refunded'
                              ? (language === 'AR' ? 'مسترد' : 'Refunded')
                              : (language === 'AR' ? 'غير مدفوع' : 'Unpaid')
                            }
                          </Badge>
                        </div>
                        {backendOrder.paymentMethod && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {language === 'AR' ? 'طريقة الدفع:' : 'Payment Method:'}
                            </span>
                            <span className="text-xs text-gray-700 capitalize">
                              {backendOrder.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  {language === 'AR' ? 'الإجراءات' : 'Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {order.status === 'delivered' && (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleReturn}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {language === 'AR' ? 'إرجاع' : 'Return'}
                    </Button>
                  )}

                  <Link href={`/contact?subject=support&order=${order?.number || ''}`}>
                  <Button 
                    className="w-full" 
                    variant="outline"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'AR' ? 'اتصل بالدعم' : 'Contact Support'}
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            {order.invoices && order.invoices.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    {language === 'AR' ? 'الفواتير' : 'Invoices'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {order.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900">
                              {invoice.number}
                            </span>
                            <p className="text-xs text-gray-500">
                              {formatDate(invoice.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-blue-100"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
