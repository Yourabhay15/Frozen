import { type NextRequest, NextResponse } from "next/server"
import { getReviewsByProductId, addReview } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const reviews = await getReviewsByProductId(productId)
    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, userId, userName, rating, title, comment, verified = false } = body

    if (!productId || !userId || !userName || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const review = await addReview({
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      verified,
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error: any) {
    if (error.message === "User has already reviewed this product") {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}
