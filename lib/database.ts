import { prisma } from "./prisma"
import { CartItem, ProductFilters, Product, Category, Order } from "./types"

// Get all cart items for a user
export async function getCart(userId: string) {
  return prisma.cart.findMany({
    where: { userId },
    include: { product: true }, // Include product details
  })
}

// Add a product to the user's cart
export async function addToCart(
  userId: string,
  item: { productId: string; quantity: number; size?: string; color?: string }
) {
  const { productId, quantity, size, color } = item

  // Check if the item already exists in the cart for the user with the same size and color
  const existingCartItem = await prisma.cart.findFirst({
    where: {
      userId,
      productId,
      size: size || null, // Treat undefined/null as null for matching
      color: color || null, // Treat undefined/null as null for matching
    },
  })

  if (existingCartItem) {
    // If it exists, update the quantity
    return prisma.cart.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    })
  } else {
    // If it doesn't exist, create a new cart item
    return prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
        size,
        color,
      },
    })
  }
}

// Remove a product from the user's cart
export async function removeFromCart(cartItemId: string) {
  const deleted = await prisma.cart.delete({
    where: { id: cartItemId },
  })
  return !!deleted
}

// Update cart item quantity
export async function updateCartItem(cartItemId: string, quantity: number) {
  return prisma.cart.update({
    where: { id: cartItemId },
    data: { quantity },
  })
}

// Clear the user's cart
export async function clearCart(userId: string) {
  const deleted = await prisma.cart.deleteMany({
    where: { userId },
  })
  return deleted.count > 0
}

// Export types for TypeScript support
export type {
  Product,
  User,
  CartItem,
  WishlistItem,
  ProductReview,
  Order,
  EmailNotification,
  ProductFilters,
  Address,
  AuditLog,
  Category,
  Discount,
  OrderItem,
  OrderStatusHistory,
} from "./types"

// Default export for convenience
// export default {
//   // Core operations
//   getProducts: neonGetProducts,
//   getProductById: neonGetProductById,
//   getUserByEmail: neonGetUserByEmail,
//
//   // Status functions
//   getDatabaseStatus,
//   getDatabaseInfo,
//   getDatabaseAnalytics,
//   getRecentActivity,
//
//   // Maintenance functions
//   runDatabaseMigrations,
//   seedDatabaseWithSampleData,
// }

// User related functions
export async function getUsers() {
  return prisma.user.findMany();
}

export async function createUser(data: any) {
  return prisma.user.create({ data });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// Product related functions
export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      discount: true,
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      discount: true,
      reviews: true,
    },
  });
}

export async function searchProducts(query: string, filters: ProductFilters) {
  const where: any = {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  if (filters.category) {
    where.category = { name: filters.category };
  }
  if (filters.minPrice) {
    where.price = { ...where.price, gte: filters.minPrice };
  }
  if (filters.maxPrice) {
    where.price = { ...where.price, lte: filters.maxPrice };
  }
  if (filters.inStock) {
    where.inventory = { gt: 0 };
  }
  if (filters.onSale) {
    where.discountId = { not: null };
  }
  if (filters.isNew) {
    where.isNew = true;
  }
  if (filters.minRating) {
    // This would require aggregation or a separate review model to calculate averageRating
    // For now, we'll skip this filter or assume a pre-calculated field
  }
  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasEvery: filters.tags };
  }

  return prisma.product.findMany({
    where,
    include: {
      discount: {
        select: {
          percentage: true,
        },
      },
      category: true,
    },
  }).then((products: any[]) => products.map((p: any) => ({
    ...p,
    discount: p.discount?.percentage,
    category: p.category?.name,
  })) as Product[]);
}

export async function getSearchSuggestions(query: string) {
  const products = await prisma.product.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    select: { id: true, name: true },
    take: 5,
  });
  const categories = await prisma.category.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    select: { id: true, name: true },
    take: 5,
  });

  const suggestions = [
    ...products.map((p: { id: string; name: string }) => ({ id: p.id, text: p.name, type: "product" as const })),
    ...categories.map((c: { id: string; name: string }) => ({ id: c.id, text: c.name, type: "category" as const })),
  ];
  return suggestions;
}

// Order related functions
export async function getOrders() {
  return prisma.order.findMany({
    include: { orderItems: true, user: true },
  });
}

export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { orderItems: true },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { orderItems: true, user: true, shippingAddress: true, billingAddress: true, statusHistory: true },
  });
}

export async function createOrder(data: any) {
  const { userId, items, shippingAddress, total, status } = data;

  let city = "Default City";
  let state = "Default State";
  let pincode = "000000";
  let addressLine1 = shippingAddress || "Default Address";

  if (shippingAddress && shippingAddress.includes(",")) {
    const parts = shippingAddress.split(",");
    addressLine1 = parts[0].trim();
    if (parts.length > 1) {
      city = parts[1].trim();
    }
    if (parts.length > 2) {
      const statePincode = parts[2].trim();
      if (statePincode.includes("-")) {
        const sp = statePincode.split("-");
        state = sp[0].trim();
        pincode = sp[1].trim();
      } else {
        state = statePincode;
      }
    }
  }

  // 1. Create an Address record for the user
  const addressRecord = await prisma.address.create({
    data: {
      userId,
      name: "Delivery Address",
      phone: data.phone || "0000000000",
      addressLine1,
      city,
      state,
      pincode,
      country: "India",
    }
  });

  // 2. Create the Order with nested orderItems
  return prisma.order.create({
    data: {
      userId,
      total: parseFloat(total),
      status: status || "pending",
      shippingAddressId: addressRecord.id,
      orderItems: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
        }))
      }
    },
    include: {
      orderItems: true,
    }
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status, statusHistory: { create: { status } } },
  });
}

// Review related functions
export async function getReviewsByProductId(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addReview(data: any) {
  return prisma.review.create({ data });
}

export async function updateReviewHelpful(reviewId: string) {
  // The 'helpful' field is not directly in the Review model in schema.prisma.
  // This function needs to be re-evaluated based on how helpfulness is tracked.
  // For now, returning a placeholder to resolve TypeScript error.
  console.warn(`[updateReviewHelpful] Function not fully implemented. Review ID: ${reviewId}`);
  return prisma.review.findUnique({ where: { id: reviewId } }); // Return existing review or null
}

// Email Notification functions
export async function createEmailNotification(data: any) {
  return prisma.emailNotification.create({ data });
}

export async function markEmailAsSent(id: string) {
  return prisma.emailNotification.update({
    where: { id },
    data: { sent: true, sentAt: new Date() },
  });
}

// Get all wishlist items for a user
export async function getWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

// Add a product to the user's wishlist
export async function addToWishlist(userId: string, productId: string) {
  // Check if already in wishlist
  const exists = await prisma.wishlist.findFirst({
    where: { userId, productId },
  })
  if (exists) throw new Error("Item already in wishlist")
  return prisma.wishlist.create({
    data: { userId, productId },
  })
}

// Remove a product from the user's wishlist
export async function removeFromWishlist(userId: string, productId: string) {
  const deleted = await prisma.wishlist.deleteMany({
    where: { userId, productId },
  })
  return deleted.count > 0
}

// Check if a product is in the user's wishlist
export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlist.findFirst({
    where: { userId, productId },
  })
  return !!item
}

// MongoDB health check using Prisma
export async function checkMongoHealth() {
  try {
    // Try a simple query on the User collection
    await prisma.user.findFirst({ select: { id: true } })
    return true
  } catch (error) {
    console.error("[MongoDB Health Check] Error:", error)
    return false
  }
}

// MongoDB analytics/stats function
export async function getDatabaseStats() {
  try {
    const [users, products, orders, categories, wishlist, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.wishlist.count(),
      prisma.review.count(),
    ])
    return {
      users,
      products,
      orders,
      categories,
      wishlist,
      reviews,
    }
  } catch (error) {
    console.error("[Database Stats] Error:", error)
    throw error
  }
}

// Utility to wrap DB calls with error handling and logging
export async function withDbErrorHandling(fn: () => Promise<any>, context?: string) {
  try {
    return await fn()
  } catch (error) {
    console.error(`[DB Error${context ? ' - ' + context : ''}]`, error)
    throw error
  }
}

// Admin sales analytics for dashboard
export async function getSalesAnalytics() {
  try {
    // Get all orders and their items
    const orders = await prisma.order.findMany({
      include: { orderItems: true }
    })
    const products = await prisma.product.findMany({ select: { id: true, name: true } })

    // Total revenue is sum of all order totals
    const totalRevenue = orders.reduce((sum: number, o: { total: number | null; orderItems: any[] }) => sum + (o.total || 0), 0)
    // Orders count
    const ordersCount = orders.length
    // Total sales is sum of all item quantities
    let totalSales = 0
    const productSales: Record<string, number> = {}
    for (const order of orders) {
      for (const item of order.orderItems) {
        totalSales += item.quantity
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity
      }
    }
    // Top products by sales
    const topProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const prod = products.find((p: { id: string; name: string }) => p.id === productId)
        return { name: prod?.name || productId, sales }
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
    return {
      totalSales,
      totalRevenue,
      ordersCount,
      topProducts,
    }
  } catch (error) {
    console.error("[Sales Analytics] Error:", error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

