import type { Timestamp } from "firebase/firestore"

export type ProductImage = {
  publicId: string
  alt: string
}

export type ProductAvailability =
  | "In Stock"
  | "Out of Stock"
  | "On Order"

export type ProductBadge =
  | "Best Seller"
  | "New Arrival"
  | "On Sale"

export type ColorVariant = {
  id: string
  label: string
  hex: string
  images: { publicId: string; alt?: string }[]
}

export type SizeVariant = {
  id: string
  label: string
  price: number
  originalPrice?: number
  availability: ProductAvailability
  specs: Record<string, string>
  features: string[]
}

export type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  images: ProductImage[]
  specs: Record<string, string>
  features: string[]
  availability: ProductAvailability
  featured: boolean
  badge?: ProductBadge
  colorVariants?: ColorVariant[]
  sizeVariants?: SizeVariant[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type SerializableProduct = Omit<
  Product,
  "createdAt" | "updatedAt"
> & {
  createdAt: number
  updatedAt: number
}

export type Category = {
  id: string
  name: string
  slug: string

  // legacy
  icon?: string

  // new
  imageUrl?: string
  imagePublicId?: string

  productCount: number
}

export type Brand = {
  id: string
  name: string
  slug: string

  logoUrl?: string
  logoPublicId?: string

  featured: boolean
  displayOrder: number
}

export type Testimonial = {
  id: string
  name: string
  city: string
  rating: number
  text: string
  createdAt: Timestamp
}

export type SerializableTestimonial = Omit<
  Testimonial,
  "createdAt"
> & {
  createdAt: number
}

export type Inquiry = {
  id: string
  productIds: string[]
  sourcePage: string
  createdAt: Timestamp
}

export type SiteSettings = {
  whatsappNumber: string
  heroHeadline: string
  heroSubheadline: string
  heroImage: ProductImage
  installmentTitle: string
  installmentDescription: string
  companyName: string
  companyAddress: string
  companyPhone: string
  socialLinks: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
}

export type CartItem = {
  id: string
  quantity: number
}