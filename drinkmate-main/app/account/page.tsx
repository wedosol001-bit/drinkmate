'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/contexts/translation-context'
import { useAuth, getAuthToken } from '@/lib/contexts/auth-context'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Package, 
  MessageCircle, 
  Edit3, 
  Save, 
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Lock,
  Shield,
  Star,
  TrendingUp,
  ShoppingBag
} from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import WishlistSidebar from '@/components/account/WishlistSidebar'
import SaudiRiyal from '@/components/ui/SaudiRiyal'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  district: string
  city: string
  country: string
  nationalAddress: string
}

interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Order {
  id: string
  number: string
  createdAt: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  itemsCount: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}


export default function AccountDashboard() {
  const { t, language, isRTL } = useTranslation()
  const { user, refreshUser, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // Ref to prevent useEffect from overwriting profile after save
  const justSavedProfile = useRef(false)
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: user?._id || '1',
    name: user?.name || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    district: (user as any)?.district || '',
    city: (user as any)?.city || '',
    country: 'Saudi Arabia',
    nationalAddress: (user as any)?.nationalAddress || ''
  })

  // Debug profile state changes
  useEffect(() => {
    console.log("Profile state updated:", profile)
  }, [profile])

  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  
  // Debug orders state changes
  useEffect(() => {
    console.log('📦 Orders state updated, count:', orders.length)
    if (orders.length > 0) {
      console.log('📦 Sample order:', orders[0])
    }
  }, [orders])
  

  // Update profile when user data changes
  // Skip update if we just saved the profile (to prevent overwriting user's edits)
  useEffect(() => {
    if (user && !justSavedProfile.current) {
      console.log("User data changed, updating profile:", user)
      console.log("User name field:", user.name)
      console.log("User username field:", user.username)
      setProfile(prev => ({
        ...prev,
        id: user._id || '1',
        name: user.name || user.username || prev.name || '',
        email: user.email || prev.email,
        phone: (user as any)?.phone || prev.phone,
        district: (user as any)?.district || prev.district,
        city: (user as any)?.city || prev.city,
        country: 'Saudi Arabia',
        nationalAddress: (user as any)?.nationalAddress || prev.nationalAddress
      }))
    }
    // Note: justSavedProfile flag is now reset in handleProfileSave after refreshUser completes
  }, [user])

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true)
        
        // Get auth token
        const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
        if (!token) {
          setError(t('account.errors.notAuthenticated'))
          return
        }

        // Fetch real orders from API - limit to 7 for account page
        console.log('🔍 Fetching orders from /api/user/orders?limit=7')
        const ordersResponse = await fetch('/api/user/orders?limit=7', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('📦 Orders response status:', ordersResponse.status, ordersResponse.statusText)

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          console.log('📦 Full orders response:', JSON.stringify(ordersData, null, 2))
          
          // Handle different response structures:
          // 1. { success: true, orders: [...] } - direct from backend
          // 2. { success: true, data: { orders: [...] } } - wrapped response
          // 3. { success: true, data: [...] } - array in data
          // 4. [...] - direct array
          let rawOrders: any[] = []
          
          if (Array.isArray(ordersData)) {
            // Direct array response
            console.log('📦 Response is direct array, length:', ordersData.length)
            rawOrders = ordersData
          } else if (ordersData?.success) {
            console.log('📦 Response has success flag')
            // Success response - check for orders in different locations
            if (Array.isArray(ordersData.orders)) {
              console.log('📦 Found orders array in ordersData.orders, length:', ordersData.orders.length)
              rawOrders = ordersData.orders
            } else if (ordersData.data) {
              if (Array.isArray(ordersData.data)) {
                console.log('📦 Found orders array in ordersData.data, length:', ordersData.data.length)
                rawOrders = ordersData.data
              } else if (Array.isArray(ordersData.data.orders)) {
                console.log('📦 Found orders array in ordersData.data.orders, length:', ordersData.data.orders.length)
                rawOrders = ordersData.data.orders
              } else {
                console.log('📦 ordersData.data exists but is not an array:', typeof ordersData.data, ordersData.data)
              }
            } else {
              console.log('📦 No orders or data field found in response. Keys:', Object.keys(ordersData))
            }
          } else {
            console.log('📦 Response structure unexpected:', typeof ordersData, ordersData)
          }
          
          console.log('📦 Raw orders extracted, count:', rawOrders.length)
          
          if (rawOrders.length > 0) {
            console.log('📦 Sample order:', rawOrders[0])
            // Transform API data to match our Order interface
            const transformedOrders: Order[] = rawOrders.map((order: any) => ({
              id: order._id || order.id,
              number: order.orderNumber || order.order_number || order.id || `DM-${order._id?.slice(-8) || 'N/A'}`,
              createdAt: order.createdAt || order.created_at || order.date || new Date().toISOString(),
              status: order.status || 'pending',
              total: typeof order.total === 'number' ? order.total : (order.totalAmount || order.total_amount || 0),
              itemsCount: Array.isArray(order.items) ? order.items.length : (order.itemsCount || 0),
              items: order.items?.map((item: any) => ({
                name: item.name || 'Unknown Item',
                quantity: item.quantity || 1,
                price: item.price || 0
              })) || []
            })) || []
            
            console.log('📦 Transformed orders count:', transformedOrders.length)
            console.log('📦 Setting orders state:', transformedOrders)
            setOrders(transformedOrders)
          } else {
            // If no orders found, set empty array
            console.warn('📦 No orders found in response')
            setOrders([])
          }
        } else {
          // If API fails, fall back to empty array
          const errorData = await ordersResponse.json().catch(() => ({}))
          console.error('📦 Failed to fetch orders:', {
            status: ordersResponse.status,
            statusText: ordersResponse.statusText,
            error: errorData
          })
          
          // If 401, log warning but don't show error to user (they're already logged in)
          if (ordersResponse.status === 401) {
            console.warn('📦 Authentication failed for orders - token may be expired or invalid')
          }
          
          setOrders([])
        }
      } catch (err) {
        setError(t('account.errors.failedLoad'))
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user) {
    fetchAccountData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const handleProfileSave = async () => {
    try {
      setIsSavingProfile(true)
      
      // Basic validation
      if (!profile.name.trim()) {
        toast.error(t('account.toasts.nameRequired'))
        setIsSavingProfile(false)
        return
      }

      // Make API call to save the profile using Next.js API route
      const token = getAuthToken()
      if (!token) {
        toast.error(t('account.toasts.loginFirst'))
        setIsSavingProfile(false)
        return
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          district: profile.district,
          city: profile.city,
          nationalAddress: profile.nationalAddress
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save profile')
      }

      // Set flag to prevent useEffect from overwriting our updates
      justSavedProfile.current = true
      
      // Update the profile state with the saved data from API response
      // The API route returns result.data (see /api/user/profile/route.ts)
      if (result.success && result.data) {
        const updatedProfile = {
          name: result.data.name || profile.name,
          phone: result.data.phone || profile.phone,
          district: result.data.district || profile.district,
          city: result.data.city || profile.city,
          nationalAddress: result.data.nationalAddress || profile.nationalAddress
        }
        setProfile(prev => ({
          ...prev,
          ...updatedProfile
        }))
        
        // Refresh user data to show updated information
        await refreshUser()
        
        // Reset flag after a delay to allow refreshUser to complete
        setTimeout(() => {
          justSavedProfile.current = false
        }, 2000)
      } else if (result.user) {
        // Fallback for direct backend response structure
        const updatedProfile = {
          name: result.user.name || (result.user.firstName && result.user.lastName ? `${result.user.firstName} ${result.user.lastName}` : profile.name),
          phone: result.user.phone || profile.phone,
          district: result.user.district || profile.district,
          city: result.user.city || profile.city,
          nationalAddress: result.user.nationalAddress || profile.nationalAddress
        }
        setProfile(prev => ({
          ...prev,
          ...updatedProfile
        }))
        
        // Refresh user data to show updated information
        await refreshUser()
        
        // Reset flag after a delay to allow refreshUser to complete
        setTimeout(() => {
          justSavedProfile.current = false
        }, 2000)
      }

      setIsEditingProfile(false)
      
      toast.success(t('account.toasts.profileSaved'))
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(t('account.toasts.profileSaveError'))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleAddressSave = async () => {
    try {
      setIsSavingAddress(true)
      
      // Basic validation
      if (!profile.district.trim() || !profile.city.trim()) {
        toast.error(t('account.toasts.addressValidation'))
        return
      }

      // Validate national address format if provided
      if (profile.nationalAddress && !/^[A-Z]{4}[0-9]{4}$/.test(profile.nationalAddress)) {
        toast.error(t('account.toasts.nationalAddressInvalid'))
        return
      }

      // Make API call to save the address
      const token = getAuthToken()
      if (!token) {
        toast.error(t('account.toasts.loginFirst'))
        return
      }

      const requestBody = {
        name: profile.name,
        phone: profile.phone,
        district: profile.district,
        city: profile.city,
        nationalAddress: profile.nationalAddress
      }
      
      console.log('Sending address update request:', requestBody)
      console.log('Token:', token ? 'Present' : 'Missing')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save address')
      }

      // Update the profile state with the saved data
      if (result.user) {
        setProfile(prev => ({
          ...prev,
          name: result.user.name || result.user.firstName + ' ' + result.user.lastName || prev.name,
          phone: result.user.phone || prev.phone,
          district: result.user.district || prev.district,
          city: result.user.city || prev.city,
          nationalAddress: result.user.nationalAddress || prev.nationalAddress
        }))
        
        // Refresh user data to show updated information
        console.log("Calling refreshUser for address save...")
        await refreshUser()
        console.log("refreshUser completed for address save")
      }
      
      setIsEditingAddress(false)
      
      // Show success message
      console.log('Address saved successfully!')
      toast.success(t('account.toasts.addressSaved'))
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error(t('account.toasts.addressSaveError'))
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setIsChangingPassword(true)
      
      console.log('🔐 Password Change: Starting...')
      
      // Basic validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error(t('account.toasts.passwordAllRequired'))
        setIsChangingPassword(false)
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error(t('account.toasts.passwordMismatch'))
        setIsChangingPassword(false)
        return
      }

      if (passwordData.newPassword.length < 8) {
        toast.error(t('account.toasts.passwordTooShort'))
        setIsChangingPassword(false)
        return
      }

      // Get auth token
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
      if (!token) {
        toast.error(t('account.toasts.passwordNotAuthenticated'))
        setIsChangingPassword(false)
        return
      }

      // Call API to change password
      console.log('🔐 Password Change: Sending request to /api/user/change-password')
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      console.log('🔐 Password Change: Response status:', response.status)
      
      let result
      try {
        result = await response.json()
        console.log('🔐 Password Change: Response data:', JSON.stringify(result, null, 2))
      } catch (jsonError) {
        console.error('🔐 Password Change: Failed to parse response:', jsonError)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        const errorMessage = result?.error || `Failed to change password (${response.status})`
        console.error('🔐 Password Change: Error response:', errorMessage)
        throw new Error(errorMessage)
      }

      // Success
      console.log('🔐 Password Change: Success!')
      toast.success(t('account.toasts.passwordChanged'))

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsChangingPassword(false)

    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(t('account.toasts.passwordChangeError'))
      setIsChangingPassword(false)
    }
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/account/orders/${orderId}`)
  }

  const handleViewAllOrders = () => {
    router.push('/account/orders')
  }



  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'processing': return <RefreshCw className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <X className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">{t('account.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('account.loadingErrorTitle')}</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>{t('account.tryAgain')}</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header with Stats */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{`${t('account.welcome')}, ${profile.name}`}</h1>
                <p className="text-blue-100 text-lg">{t('account.manageAccount')}</p>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{orders.length}</div>
                  <div className="text-blue-100 text-sm">{t('account.stats.orders')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="text-blue-100 text-sm flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {t('account.stats.rating')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Profile & Security */}
          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  {t('account.profile.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isEditingProfile ? (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        {t('account.profile.fullName')}
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        {t('account.profile.phoneNumber')}
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        {t('account.profile.email')}
                      </Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="mt-2 bg-gray-50 border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('account.profile.emailUnchangeable')}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleProfileSave} 
                        disabled={isSavingProfile}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isSavingProfile ? t('account.profile.saving') || 'Saving...' : t('account.profile.save')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isSavingProfile}
                        className="px-6"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('account.profile.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t('account.profile.fullName')}</p>
                        <p className="font-semibold text-lg">{profile.name}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                        className="hover:bg-blue-50"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        {t('account.profile.edit')}
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('account.profile.email')}</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('account.profile.phone')}</p>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  {t('account.address.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isEditingAddress ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district" className="text-sm font-semibold text-gray-700">
                          {t('account.address.district')}
                        </Label>
                        <Input
                          id="district"
                          value={profile.district}
                          onChange={(e) => setProfile({
                            ...profile, 
                            district: e.target.value
                          })}
                          className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder={t('account.address.enterDistrict')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                          {t('account.address.city')}
                        </Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => setProfile({
                            ...profile, 
                            city: e.target.value
                          })}
                          className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder={t('account.address.enterCity')}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                        {t('account.address.country')}
                      </Label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 mt-2">
                        {t('account.address.countryValue')}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nationalAddress" className="text-sm font-semibold text-gray-700">
                        {t('account.address.shortAddress')} (<a href="https://splonline.com.sa/en/national-address-1/" target="_blank" rel="noopener noreferrer" className="text-[#12d6fa] hover:text-[#0bc4e8] underline">{t('account.address.nationalAddressLink')}</a>) {t('account.address.optional')}
                      </Label>
                      <Input
                        id="nationalAddress"
                        value={profile.nationalAddress}
                        onChange={(e) => setProfile({
                          ...profile, 
                          nationalAddress: e.target.value.toUpperCase()
                        })}
                        className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono tracking-wider"
                        placeholder={t('account.address.placeholder')}
                        maxLength={8}
                        pattern="[A-Z]{4}[0-9]{4}"
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('account.address.formatHint')}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddressSave} 
                        disabled={isSavingAddress}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {isSavingAddress ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isSavingAddress ? t('account.address.saving') : t('account.address.save')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingAddress(false)}
                        disabled={isSavingAddress}
                        className="px-6"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('account.address.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t('account.address.viewLabel')}</p>
                        <p className="font-semibold text-lg">{profile.district}</p>
                        <p className="text-gray-600">
                          {profile.city}, {profile.country}
                          {profile.nationalAddress && ` - ${profile.nationalAddress}`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingAddress(true)}
                        className="hover:bg-green-50"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        {t('account.address.edit')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lock className="h-6 w-6 text-purple-600" />
                  </div>
                  {t('account.password.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isChangingPassword ? (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">
                        {t('account.password.current')}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
                        {t('account.password.new')}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        {t('account.password.confirm')}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handlePasswordChange} 
                        disabled={isChangingPassword}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        {isChangingPassword ? t('account.password.changing') || 'Changing...' : t('account.password.change')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsChangingPassword(false)}
                        disabled={isChangingPassword}
                        className="px-6"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('account.password.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{t('account.password.security')}</p>
                        <p className="font-semibold text-lg">{t('account.password.strong')}</p>
                        <p className="text-sm text-gray-600">{t('account.password.lastUpdated')}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsChangingPassword(true)}
                        className="hover:bg-purple-50"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {language === 'AR' ? 'تغيير' : 'Change'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wishlist Sidebar */}
            <WishlistSidebar />
        </div>

          {/* Right Column - Orders & Support */}
          <div className="xl:col-span-2 space-y-6">
            {/* Orders & Returns */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>
                  {t('account.orders.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">{t('account.orders.noOrders') || 'No orders found'}</p>
                    </div>
                  ) : (
                    <>
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg text-gray-900">#{order.number}</span>
                              <Badge className={cn("px-3 py-1", getStatusColor(order.status))}>
                                <span className="flex items-center gap-2">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl text-gray-900">
                                <SaudiRiyal amount={order.total} size="lg" />
                              </div>
                              <p className="text-sm text-gray-500">{order.itemsCount} {t('account.orders.itemsSuffix')}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              {order.items.map((item, index) => (
                                <span key={index}>
                                  {item.name} (x{item.quantity})
                                  {index < order.items.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              className="hover:bg-orange-50 hover:border-orange-200"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t('account.orders.view')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg font-semibold hover:bg-orange-50 hover:border-orange-200"
                    onClick={handleViewAllOrders}
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {t('account.orders.viewAll')}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
