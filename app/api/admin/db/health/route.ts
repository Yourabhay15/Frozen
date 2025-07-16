import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkMongoHealth } from "@/lib/database"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!(session?.user && (session.user as any).isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const healthy = await checkMongoHealth()
  return NextResponse.json({ healthy })
} 