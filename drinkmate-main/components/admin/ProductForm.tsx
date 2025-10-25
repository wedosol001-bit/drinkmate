"use client"

import { useState, useEffect } from "react"
import { adminAPI } from "@/lib/api"
import { getAuthToken } from "@/lib/contexts/auth-context"
import { SafeImage } from "@/components/ui/safe-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import CloudinaryImageUpload from "@/components/ui/cloudinary-image-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Loader2
} from "lucide-react"

interface ProductFormProps {
  product?: any
  isBundle?: boolean
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

interface ProductSpecification {
  key: string
  value: string
}

interface ProductFeature {
  title: string
  description: string
  icon?: string
}

interface ProductDocument {
  name: string
  url: string
  type: string
}

export default function ProductForm({
  product,
  isBundle = false,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ProductFormProps) {
  const isEditing = !!product

  const [formData, setFormData] = useState({
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    stock: product?.stock || "",
    minStock: product?.minStock || "",
    shortDescription: product?.shortDescription || "",
    shortDescriptionAr: product?.shortDescriptionAr || "",
    fullDescription: product?.description || product?.fullDescription || "",
    fullDescriptionAr: product?.fullDescriptionAr || "",
    sku: product?.sku || "",
    brand: product?.brand || "",
    type: product?.type || "",
    material: product?.material || "",
    capacity: product?.capacity || "",
    status: product?.status || "active",
    colors: product?.colors ? product.colors.map((color: any) => typeof color === 'string' ? color : color.name) : [],
    images: [] as string[], // Explicitly type as string array
    isBestSeller: product?.isBestSeller || false,
    isNewProduct: product?.isNewProduct || false,
    isFeatured: product?.isFeatured || false,
    isEcoFriendly: product?.isEcoFriendly || false,
    weight: product?.weight ? (typeof product.weight === 'string' ? product.weight : product.weight.value?.toString() || "") : "",
    dimensions: product?.dimensions ? (typeof product.dimensions === 'string' ? product.dimensions : `${product.dimensions.length || 0} x ${product.dimensions.width || 0} x ${product.dimensions.height || 0}`) : "",
    warranty: product?.warranty || "",
    // Advanced fields
    features: product?.features || [],
    specifications: product?.specifications || {},
    safetyFeatures: product?.safetyFeatures || [],
    // Product variants
    hasVariants: product?.hasVariants || false,
    variants: product?.variants || [],
    compatibility: product?.compatibility || [],
    certifications: product?.certifications || [],
    tags: product?.tags || [],
    // Media fields
    videos: product?.videos || [],
    youtubeLinks: product?.youtubeLinks || [],
    documents: product?.documents || [],
    // SEO fields
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    // Bundle specific fields
    products: product?.products || [],
    bundleDiscount: product?.bundleDiscount || "",
  })

  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images ? (Array.isArray(product.images) ? 
      product.images.map((img: any) => {
        if (typeof img === 'string') return img
        if (img && typeof img === 'object') {
          return img.url || img._id || ''
        }
        return ''
      }).filter((url: string) => url && url.trim() !== '') : 
      []) : []
  )
  const [newColor, setNewColor] = useState("")
  const [newFeature, setNewFeature] = useState({ title: "", description: "" })
  const [newSpecification, setNewSpecification] = useState({ key: "", value: "" })
  const [newSafetyFeature, setNewSafetyFeature] = useState("")
  const [newCompatibility, setNewCompatibility] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newYoutubeLink, setNewYoutubeLink] = useState("")
  const [newDocument, setNewDocument] = useState({ name: "", url: "", type: "" })
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [hasAttemptedCategoryCreation, setHasAttemptedCategoryCreation] = useState(false)
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Set first category as default when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0]._id
      }))
    }
  }, [categories, formData.category])

  // Initialize form data when product prop changes (for editing)
  useEffect(() => {
    if (product) {
      // Convert image objects to strings for the form
      const imageUrls = product.images ? product.images.map((img: any) => {
        if (typeof img === 'string') return img
        if (img && typeof img === 'object') {
          return img.url || img._id || ''
        }
        return ''
      }).filter((url: string) => url && url.trim() !== '') : []
      
      setFormData({
        name: product.name || "",
        nameAr: product.nameAr || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        stock: product.stock || "",
        minStock: product.minStock || "",
        shortDescription: product.shortDescription || "",
        shortDescriptionAr: product.shortDescriptionAr || "",
        fullDescription: product.description || product.fullDescription || "",
        fullDescriptionAr: product.fullDescriptionAr || "",
        sku: product.sku || "",
        brand: product.brand || "",
        type: product.type || "",
        material: product.material || "",
        capacity: product.capacity || "",
        status: product.status || "active",
        images: imageUrls,
        colors: product.colors ? product.colors.map((color: any) => typeof color === 'string' ? color : color.name) : [],
        isBestSeller: product.bestSeller || product.isBestSeller || false,
        isNewProduct: product.newArrival || product.isNewProduct || false,
        isFeatured: product.featured || product.isFeatured || false,
        isEcoFriendly: product.isEcoFriendly || false,
        weight: product.weight ? (typeof product.weight === 'string' ? product.weight : product.weight.value?.toString() || "") : "",
        dimensions: product.dimensions ? (typeof product.dimensions === 'string' ? product.dimensions : `${product.dimensions.length || 0} x ${product.dimensions.width || 0} x ${product.dimensions.height || 0}`) : "",
        warranty: product.warranty || "",
        features: product.features || [],
        specifications: product.specifications || {},
        safetyFeatures: product.safetyFeatures || [],
        compatibility: product.compatibility || [],
        certifications: product.certifications || [],
        tags: product.tags || [],
        videos: product.videos || [],
        youtubeLinks: product.youtubeLinks || [],
        documents: product.documents || [],
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        products: product.products || [],
        bundleDiscount: product.bundleDiscount || "",
        hasVariants: product.hasVariants || false,
        variants: product.variants || [],
      })
      
      // Initialize uploadedImages for editing mode
      if (imageUrls.length > 0) {
        setUploadedImages(imageUrls)
      }
    }
  }, [product])

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      console.log('🔍 ProductForm: Fetching categories...')
      const response = await adminAPI.getCategories()
      console.log('📡 ProductForm: API Response:', response)
      
      if (response.success) {
        console.log('✅ ProductForm: Categories fetched successfully:', response.categories)
        setCategories(response.categories || [])
        
        // If no categories exist and we haven't tried to create them yet, create default ones
        if (response.categories && response.categories.length === 0 && !hasAttemptedCategoryCreation) {
          console.log('📝 No categories found, creating default ones...')
          setHasAttemptedCategoryCreation(true)
          await createDefaultCategories()
        }
      } else {
        console.error('❌ ProductForm: Failed to fetch categories:', response)
      }
    } catch (error) {
      console.error('💥 ProductForm: Error fetching categories:', error)
    }
  }

  // Create default categories if none exist
  const createDefaultCategories = async (forceReset = false) => {
    try {
      console.log(`🚀 ProductForm: Creating default categories${forceReset ? ' (force reset)' : ''}...`)
      
      const data = await adminAPI.createDefaultCategories(forceReset)
      console.log('📡 ProductForm: Create categories response:', data)
      
      if (data.success) {
        // Refresh categories after creation
        setHasAttemptedCategoryCreation(false) // Reset flag for future use
        await fetchCategories()
      } else {
        console.error('API Error:', data)
        // Reset flag on error so we can try again
        setHasAttemptedCategoryCreation(false)
      }
    } catch (error) {
      console.error('💥 ProductForm: Error creating default categories:', error)
      // Reset flag on exception so we can try again
      setHasAttemptedCategoryCreation(false)
    }
  }

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category?.subcategories || []
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }



  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      })
      setNewColor("")
    }
  }

  const removeColor = (index: number) => {
    const newColors = [...formData.colors]
    newColors.splice(index, 1)
    setFormData({
      ...formData,
      colors: newColors
    })
  }

  // Variant management
  const addVariant = () => {
    const newVariant = {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      image: '',
      attributes: {
        color: ''
      },
      isDefault: formData.variants.length === 0
    }
    
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant]
    })
  }

  const removeVariant = (index: number) => {
    const newVariants = [...formData.variants]
    newVariants.splice(index, 1)
    setFormData({
      ...formData,
      variants: newVariants
    })
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    }
    setFormData({
      ...formData,
      variants: newVariants
    })
  }

  const updateVariantAttribute = (index: number, attribute: string, value: string) => {
    const newVariants = [...formData.variants]
    newVariants[index] = {
      ...newVariants[index],
      attributes: {
        ...newVariants[index].attributes,
        [attribute]: value
      }
    }
    setFormData({
      ...formData,
      variants: newVariants
    })
  }

  // Feature management
  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      setFormData({
        ...formData,
        features: [...formData.features, { ...newFeature }]
      })
      setNewFeature({ title: "", description: "" })
    }
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData({
      ...formData,
      features: newFeatures
    })
  }

  // Specification management
  const addSpecification = () => {
    if (newSpecification.key && newSpecification.value) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [newSpecification.key]: newSpecification.value
        }
      })
      setNewSpecification({ key: "", value: "" })
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData({
      ...formData,
      specifications: newSpecs
    })
  }

  // Safety features management
  const addSafetyFeature = () => {
    if (newSafetyFeature) {
      setFormData({
        ...formData,
        safetyFeatures: [...formData.safetyFeatures, newSafetyFeature]
      })
      setNewSafetyFeature("")
    }
  }

  const removeSafetyFeature = (index: number) => {
    const newFeatures = [...formData.safetyFeatures]
    newFeatures.splice(index, 1)
    setFormData({
      ...formData,
      safetyFeatures: newFeatures
    })
  }

  // Compatibility management
  const addCompatibility = () => {
    if (newCompatibility) {
      setFormData({
        ...formData,
        compatibility: [...formData.compatibility, newCompatibility]
      })
      setNewCompatibility("")
    }
  }

  const removeCompatibility = (index: number) => {
    const newCompat = [...formData.compatibility]
    newCompat.splice(index, 1)
    setFormData({
      ...formData,
      compatibility: newCompat
    })
  }

  // Certification management
  const addCertification = () => {
    if (newCertification) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification]
      })
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    const newCerts = [...formData.certifications]
    newCerts.splice(index, 1)
    setFormData({
      ...formData,
      certifications: newCerts
    })
  }

  // Tags management
  const addTag = () => {
    if (newTag) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      })
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    setFormData({
      ...formData,
      tags: newTags
    })
  }

  // YouTube links management
  const addYoutubeLink = () => {
    if (newYoutubeLink) {
      setFormData({
        ...formData,
        youtubeLinks: [...formData.youtubeLinks, newYoutubeLink]
      })
      setNewYoutubeLink("")
    }
  }

  const removeYoutubeLink = (index: number) => {
    const newLinks = [...formData.youtubeLinks]
    newLinks.splice(index, 1)
    setFormData({
      ...formData,
      youtubeLinks: newLinks
    })
  }

  // Document management
  const addDocument = () => {
    if (newDocument.name && newDocument.url && newDocument.type) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...newDocument }]
      })
      setNewDocument({ name: "", url: "", type: "" })
    }
  }

  const removeDocument = (index: number) => {
    const newDocs = [...formData.documents]
    newDocs.splice(index, 1)
    setFormData({
      ...formData,
      documents: newDocs
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Generate SKU if not provided
    let finalFormData = { ...formData }
    if (!finalFormData.sku.trim()) {
      const timestamp = Date.now().toString().slice(-6)
      const nameSlug = finalFormData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 4)
      finalFormData.sku = `${nameSlug}-${timestamp}`
    }
    
    // Create final data object with images - use formData.images which should be array of strings
    const finalData = {
      ...finalFormData,
      images: Array.isArray(finalFormData.images) ? finalFormData.images.filter((img: string) => img && img.trim() !== '') : []
    }
    
        console.log('=== FORM SUBMISSION DEBUG ===')
        console.log('Original form data:', formData)
        console.log('Final form data with SKU:', finalFormData)
        console.log('Uploaded images:', uploadedImages)
        console.log('Final data with images:', finalData)
        console.log('Images array type:', typeof finalData.images)
        console.log('Images array length:', finalData.images?.length)
        if (finalData.images && finalData.images.length > 0) {
          finalData.images.forEach((img: any, index: number) => {
            console.log(`Image ${index}:`, { value: img, type: typeof img, isString: typeof img === 'string', isObject: typeof img === 'object' })
          })
        }
        console.log('=== END FORM SUBMISSION DEBUG ===')
        
        onSubmit(finalData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit ${isBundle ? 'Bundle' : 'Product'}` : `Add New ${isBundle ? 'Bundle' : 'Product'}`}
          </h1>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
                         <Button 
               type="submit" 
               className="bg-[#12d6fa] hover:bg-[#0fb8d9]"
               disabled={isSubmitting}
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="mr-2 h-4 w-4" />
                   Save {isBundle ? 'Bundle' : 'Product'}
                 </>
               )}
             </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            {isBundle && <TabsTrigger value="bundle">Bundle Items</TabsTrigger>}
            {!isBundle && <TabsTrigger value="variants">Variants</TabsTrigger>}
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">Name (Arabic)</Label>
                    <Input
                      id="nameAr"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleChange}
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select 
                      value={formData.subcategory} 
                      onValueChange={(value) => handleSelectChange("subcategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubcategoriesForCategory(formData.category).map((subcategory: any) => (
                          <SelectItem key={subcategory._id} value={subcategory._id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (﷼)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (﷼)</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description (English)</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescriptionAr">Short Description (Arabic)</Label>
                  <Textarea
                    id="shortDescriptionAr"
                    name="shortDescriptionAr"
                    value={formData.shortDescriptionAr}
                    onChange={handleChange}
                    rows={2}
                    placeholder="وصف مختصر بالعربية"
                  />
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isBestSeller" 
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, isBestSeller: checked === true})
                      }
                    />
                    <Label htmlFor="isBestSeller">Best Seller</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isNewProduct" 
                      name="isNewProduct"
                      checked={formData.isNewProduct}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, isNewProduct: checked === true})
                      }
                    />
                    <Label htmlFor="isNewProduct">New Product</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isFeatured" 
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, isFeatured: checked === true})
                      }
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isEcoFriendly" 
                      name="isEcoFriendly"
                      checked={formData.isEcoFriendly}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, isEcoFriendly: checked === true})
                      }
                    />
                    <Label htmlFor="isEcoFriendly">Eco Friendly</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Description (English)</Label>
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescriptionAr">Full Description (Arabic)</Label>
                  <Textarea
                    id="fullDescriptionAr"
                    name="fullDescriptionAr"
                    value={formData.fullDescriptionAr}
                    onChange={handleChange}
                    rows={6}
                    placeholder="وصف مفصل بالعربية"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (cm)</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      placeholder="L x W x H"
                      value={formData.dimensions}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    placeholder="e.g., 1 year manufacturer warranty"
                  />
                </div>

                {isBundle && (
                  <div className="space-y-2">
                    <Label htmlFor="bundleDiscount">Bundle Discount (%)</Label>
                    <Input
                      id="bundleDiscount"
                      name="bundleDiscount"
                      type="number"
                      value={formData.bundleDiscount}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Specifications Tab */}
          <TabsContent value="specifications">
            <div className="space-y-6">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Feature title"
                      value={newFeature.title}
                      onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                      className="max-w-xs"
                    />
                    <Input
                      placeholder="Feature description"
                      value={newFeature.description}
                      onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addFeature}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  
                  {formData.features.length > 0 ? (
                    <div className="space-y-2">
                      {formData.features.map((feature: any, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                        >
                          <div>
                            <p className="font-medium">{feature.title}</p>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No features added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Specification key"
                      value={newSpecification.key}
                      onChange={(e) => setNewSpecification({...newSpecification, key: e.target.value})}
                      className="max-w-xs"
                    />
                    <Input
                      placeholder="Specification value"
                      value={newSpecification.value}
                      onChange={(e) => setNewSpecification({...newSpecification, value: e.target.value})}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addSpecification}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Spec
                    </Button>
                  </div>
                  
                  {Object.keys(formData.specifications).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div 
                          key={key} 
                          className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{key}:</span>
                            <span className="text-gray-600">{String(value)}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSpecification(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No specifications added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Safety Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Safety Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add safety feature"
                      value={newSafetyFeature}
                      onChange={(e) => setNewSafetyFeature(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addSafetyFeature}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {formData.safetyFeatures.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.safetyFeatures.map((feature: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-green-100 text-green-800 rounded-full pl-3 pr-2 py-1"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            className="ml-2 text-green-600 hover:text-red-500"
                            onClick={() => removeSafetyFeature(index)}
                            aria-label={`Remove safety feature ${feature}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No safety features added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Compatibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add compatibility item"
                      value={newCompatibility}
                      onChange={(e) => setNewCompatibility(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addCompatibility}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {formData.compatibility.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.compatibility.map((item: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full pl-3 pr-2 py-1"
                        >
                          <span className="text-sm">{item}</span>
                          <button
                            type="button"
                            className="ml-2 text-blue-600 hover:text-red-500"
                            onClick={() => removeCompatibility(index)}
                            aria-label={`Remove compatibility item ${item}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No compatibility items added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addCertification}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {formData.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-purple-100 text-purple-800 rounded-full pl-3 pr-2 py-1"
                        >
                          <span className="text-sm">{cert}</span>
                          <button
                            type="button"
                            className="ml-2 text-purple-600 hover:text-red-500"
                            onClick={() => removeCertification(index)}
                            aria-label={`Remove certification ${cert}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No certifications added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addTag}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-gray-100 text-gray-800 rounded-full pl-3 pr-2 py-1"
                        >
                          <span className="text-sm">{tag}</span>
                          <button
                            type="button"
                            className="ml-2 text-gray-600 hover:text-red-500"
                            onClick={() => removeTag(index)}
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No tags added yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Media Tab */}
          <TabsContent value="media">
            <div className="space-y-6">
              {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <CloudinaryImageUpload
                  onImagesChange={(images) => {
                    setUploadedImages(images)
                    // Also update formData with image URLs
                    setFormData(prev => ({
                      ...prev,
                      images: images
                    }))
                  }}
                  currentImages={uploadedImages}
                  maxImages={5}
                  disabled={isSubmitting}
                />
                </CardContent>
              </Card>

              {/* YouTube Videos */}
              <Card>
                <CardHeader>
                  <CardTitle>YouTube Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="YouTube video URL"
                      value={newYoutubeLink}
                      onChange={(e) => setNewYoutubeLink(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addYoutubeLink}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                  
                  {formData.youtubeLinks.length > 0 ? (
                    <div className="space-y-2">
                      {formData.youtubeLinks.map((link: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                        >
                          <span className="text-sm font-mono">{link}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeYoutubeLink(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No YouTube videos added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Document name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                      className="max-w-xs"
                    />
                    <Input
                      placeholder="Document URL"
                      value={newDocument.url}
                      onChange={(e) => setNewDocument({...newDocument, url: e.target.value})}
                      className="max-w-xs"
                    />
                    <Select 
                      value={newDocument.type} 
                      onValueChange={(value) => setNewDocument({...newDocument, type: value})}
                    >
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="warranty">Warranty</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addDocument}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {formData.documents.length > 0 ? (
                    <div className="space-y-2">
                      {formData.documents.map((doc: any, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                        >
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type} - {doc.url}</p>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No documents added yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="Custom title for search engines"
                  />
                  <p className="text-sm text-gray-500">
                    {formData.seoTitle.length}/60 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Custom description for search engines"
                  />
                  <p className="text-sm text-gray-500">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Variants Tab */}
          <TabsContent value="variants">
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVariants"
                    checked={formData.hasVariants}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasVariants: !!checked }))}
                  />
                  <Label htmlFor="hasVariants">This product has variants (different colors, sizes, etc.)</Label>
                </div>
              </CardHeader>
              <CardContent>
                {formData.hasVariants ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Product Variants</h4>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addVariant()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>
                    
                    {formData.variants.length > 0 ? (
                      <div className="space-y-4">
                        {formData.variants.map((variant: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h5 className="font-semibold">Variant {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeVariant(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`variant-name-${index}`}>Variant Name</Label>
                                <Input
                                  id={`variant-name-${index}`}
                                  value={variant.name}
                                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                  placeholder="e.g., Red, Large, Premium"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`variant-sku-${index}`}>SKU (Optional)</Label>
                                <Input
                                  id={`variant-sku-${index}`}
                                  value={variant.sku || ''}
                                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                  placeholder="e.g., PROD-RED-L"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`variant-price-${index}`}>Price (SAR)</Label>
                                <Input
                                  id={`variant-price-${index}`}
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`variant-stock-${index}`}>Stock Quantity</Label>
                                <Input
                                  id={`variant-stock-${index}`}
                                  type="number"
                                  value={variant.stock || ''}
                                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              
                              <div>
                                <Label>Variant Image</Label>
                                <CloudinaryImageUpload
                                  onImagesChange={(images) => {
                                    if (images.length > 0) {
                                      updateVariant(index, 'image', images[0])
                                    } else {
                                      updateVariant(index, 'image', '')
                                    }
                                  }}
                                  currentImages={variant.image ? [variant.image] : []}
                                  maxImages={1}
                                  disabled={isSubmitting}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`variant-color-${index}`}>Color (Optional)</Label>
                                <Input
                                  id={`variant-color-${index}`}
                                  value={variant.attributes?.color || ''}
                                  onChange={(e) => updateVariantAttribute(index, 'color', e.target.value)}
                                  placeholder="e.g., Red, Blue, Green"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No variants added yet. Click "Add Variant" to create product variants.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Enable variants to create different versions of this product (colors, sizes, etc.)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Bundle Items Tab */}
          {isBundle && (
            <TabsContent value="bundle">
              <Card>
                <CardHeader>
                  <CardTitle>Bundle Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Select products to include in this bundle
                  </p>
                  
                  {/* This would be a product selector in a real application */}
                  <div className="space-y-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Products to Bundle
                    </Button>
                    
                    {formData.products.length > 0 ? (
                      <div className="space-y-2">
                                                 {formData.products.map((bundleProduct: any, index: number) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between border rounded-md p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-md"></div>
                              <div>
                                <p className="font-medium">{bundleProduct.name}</p>
                                <p className="text-sm text-gray-500">﷼{bundleProduct.price}</p>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-gray-500">No products added to this bundle yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </form>
  )
}
