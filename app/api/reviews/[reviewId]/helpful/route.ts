import { type NextRequest, NextResponse } from "next/server"
import { updateReviewHelpful } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    const body = await request.json()
    const { increment = true } = body

    const review = await updateReviewHelpful(params.reviewId)

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
