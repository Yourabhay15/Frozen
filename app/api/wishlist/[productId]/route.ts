import { type NextRequest, NextResponse } from "next/server"
import { removeFromWishlist, isInWishlist } from "@/lib/database"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id

    const success = await removeFromWishlist(userId, productId)

    if (!success) {
      return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Item removed from wishlist" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id

    const inWishlist = await isInWishlist(userId, productId)
    return NextResponse.json({ success: true, data: { inWishlist } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to check wishlist status" }, { status: 500 })
  }
}
