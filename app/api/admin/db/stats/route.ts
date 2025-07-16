import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabaseStats } from "@/lib/database"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!(session?.user && (session.user as any).isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const stats = await getDatabaseStats()
    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch database stats" }, { status: 500 })
  }
} 