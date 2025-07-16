import { type NextRequest, NextResponse } from "next/server"
import { getOrders, createOrder, getOrdersByUserId, clearCart } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const orders = await getOrdersByUserId(userId)
      return NextResponse.json({ success: true, data: orders })
    } else {
      const orders = await getOrders()
      return NextResponse.json({ success: true, data: orders })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "items", "shippingAddress", "paymentMethod", "total"]
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
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
