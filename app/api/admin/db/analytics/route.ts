import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSalesAnalytics } from "@/lib/database"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!(session?.user && (session.user as any).isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const analytics = await getSalesAnalytics()
    return NextResponse.json({ analytics })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
} 