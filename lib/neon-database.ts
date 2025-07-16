import { neon } from "@neondatabase/serverless"
import type {
  Product,
  User,
  CartItem,
  WishlistItem,
  ProductReview,
  EmailNotification,
  ProductFilters,
  Order,
} from "./types"
import bcrypt from "bcryptjs"

// console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

// // Check if DATABASE_URL environment variable is set
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is not set")
// }

// // Initialize Neon client
// const sql = neon(process.env.DATABASE_URL)

// ===================== DATABASE FUNCTIONS COMMENTED OUT FOR LOCAL DEVELOPMENT =====================
// export async function initializeDatabase() { /* ... */ }
// export async function seedDatabase() { /* ... */ }
// export async function getProducts(): Promise<Product[]> { /* ... */ }
// export async function getProductById(id: number): Promise<Product | null> { /* ... */ }
// export async function addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "averageRating" | "totalReviews">): Promise<Product> { /* ... */ }
// export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> { /* ... */ }
// export async function deleteProduct(id: number): Promise<boolean> { /* ... */ }
// export async function getUserByEmail(email: string): Promise<User | null> { /* ... */ }
// export async function createUser(userData: { email: string; name: string; phone?: string; password: string; role?: string }): Promise<User> { /* ... */ }
// export async function verifyPassword(email: string, password: string): Promise<User | null> { /* ... */ }
// export async function getCart(userId: number): Promise<CartItem[]> { /* ... */ }
// export async function addToCart(userId: number, item: Omit<CartItem, "id" | "createdAt">): Promise<CartItem[]> { /* ... */ }
// export async function removeFromCart(userId: number, itemId: number): Promise<CartItem[]> { /* ... */ }
// export async function updateCartItem(userId: number, itemId: number, quantity: number): Promise<CartItem[]> { /* ... */ }
// export async function clearCart(userId: number): Promise<void> { /* ... */ }
// export async function getWishlist(userId: number): Promise<WishlistItem[]> { /* ... */ }
// export async function addToWishlist(userId: number, productId: number): Promise<WishlistItem> { /* ... */ }
// export async function removeFromWishlist(userId: number, productId: number): Promise<boolean> { /* ... */ }
// export async function isInWishlist(userId: number, productId: number): Promise<boolean> { /* ... */ }
// export async function getReviewsByProductId(productId: number): Promise<ProductReview[]> { /* ... */ }
// export async function addReview(reviewData: Omit<ProductReview, "id" | "createdAt" | "helpfulCount">): Promise<ProductReview> { /* ... */ }
// export async function updateReviewHelpful(reviewId: number, increment: boolean): Promise<ProductReview | null> { /* ... */ }
// export async function searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> { /* ... */ }
// export async function getSearchSuggestions(query: string): Promise<any[]> { /* ... */ }
// export async function getOrders(): Promise<Order[]> { /* ... */ }
// export async function getOrdersByUserId(userId: number): Promise<Order[]> { /* ... */ }
// export async function getOrderById(orderId: number): Promise<Order | null> { /* ... */ }
// export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> { /* ... */ }
// export async function updateOrderStatus(orderId: number, status: Order["status"]): Promise<Order | null> { /* ... */ }
// export async function createEmailNotification(emailData: Omit<EmailNotification, "id" | "createdAt">): Promise<EmailNotification> { /* ... */ }
// export async function markEmailAsSent(emailId: number): Promise<boolean> { /* ... */ }
// export async function testConnection() { /* ... */ }
// export { sql }
