import { type NextRequest, NextResponse } from "next/server"
import { getWishlist, addToWishlist } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
  }
  try {
    const wishlist = await getWishlist(userId)
    return NextResponse.json({ success: true, data: wishlist })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { userId, productId } = await request.json()
  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
  }
  try {
    const wishlistItem = await addToWishlist(userId, productId)
    return NextResponse.json({ success: true, data: wishlistItem })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Item already in wishlist") {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}
