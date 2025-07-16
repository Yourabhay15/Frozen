export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  category?: string
  discountId?: string | null
  discount?: number // Added for direct access to discount percentage
  image?: string | null
  images: string[]
  status: string
  isNew: boolean
  sizes: string[]
  inventory: number // Renamed from 'stock' for consistency with schema
  material?: string | null // Changed to allow null
  care?: string | null // Changed to allow null
  origin?: string | null // Changed to allow null
  createdAt: Date
  updatedAt: Date
  reviews?: any[]
  wishlist?: any[]
  cart?: any[]
  orderItems?: any[]
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  averageRating?: number
  totalReviews?: number
}

export interface User {
  id: string
  email: string
  password?: string // Added for consistency with database model, though not always exposed
  name: string
  phone?: string
  isAdmin: boolean
  role: string // Added for consistency with NextAuth session
  addresses?: Address[]
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface UserPreferences {
  newsletter: boolean
  smsUpdates: boolean
  preferredLanguage: string
  preferredCurrency: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  size?: string | null
  color?: string | null
  product?: Product // Optional: if you want to include product details when fetching cart
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  addedAt: Date
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  verified: boolean
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  size?: string
  color?: string
  price: number
  discount: number
}

export interface EmailNotification {
  id: string
  userId: string
  type: "order_confirmation" | "order_shipped" | "order_delivered" | "password_reset" | "welcome"
  subject: string
  content: string
  sent: boolean
  sentAt?: string
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  onSale?: boolean
  isNew?: boolean
  search?: string
  tags?: string[]
  minRating?: number
  sortBy?: "price" | "rating" | "newest" | "popular"
  sortOrder?: "asc" | "desc"
}

export interface SearchSuggestion {
  id: string
  text: string
  type: "product" | "category" | "brand"
  count?: number
}

export interface Category {
  id: string
  name: string
}

export interface Discount {
  id: string
  name: string
  percentage: number
}

export interface OrderStatusHistory {
  id: string
  orderId: string
  status: string
  changedAt: string
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  entity: string
  entityId?: string
  details?: string
  createdAt: Date
}
