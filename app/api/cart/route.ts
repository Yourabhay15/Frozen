import { type NextRequest, NextResponse } from "next/server"
import { getCart, addToCart } from "@/lib/database"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const cart = await getCart(userId)
    return NextResponse.json({ success: true, data: cart })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { productId, quantity, size, color } = body

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cart = await addToCart(userId, {
      productId,
      quantity,
      size,
      color,
    })

    return NextResponse.json({ success: true, data: cart })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
