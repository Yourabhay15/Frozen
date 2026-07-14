import { type NextRequest, NextResponse } from "next/server"
import { getWishlist, addToWishlist } from "@/lib/database"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wishlist = await getWishlist(user.id)
    return NextResponse.json({ success: true, data: wishlist })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
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

    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 })
    }

    const wishlistItem = await addToWishlist(user.id, productId)
    return NextResponse.json({ success: true, data: wishlistItem })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Item already in wishlist") {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}
