import { type NextRequest, NextResponse } from "next/server"
import { getOrders, createOrder, getOrdersByUserId, clearCart } from "@/lib/database"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    const isAdmin = dbUser?.isAdmin || dbUser?.role === "admin"

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      if (userId !== user.id && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const orders = await getOrdersByUserId(userId)
      return NextResponse.json({ success: true, data: orders })
    } else {
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const orders = await getOrders()
      return NextResponse.json({ success: true, data: orders })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "items", "shippingAddress", "paymentMethod", "total"]
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    if (orderData.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create order
    const order = await createOrder({
      ...orderData,
      paymentStatus: "pending",
      status: "pending",
    })

    // Clear user's cart after successful order
    await clearCart(orderData.userId)

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
