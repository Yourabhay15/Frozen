import { type NextRequest, NextResponse } from "next/server"
import { removeFromCart, updateCartItem } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const body = await request.json()
    const { userId, quantity } = body

    if (!userId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cart = await updateCartItem(itemId, quantity)
    return NextResponse.json({ success: true, data: cart })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const cart = await removeFromCart(itemId)
    return NextResponse.json({ success: true, data: cart })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
