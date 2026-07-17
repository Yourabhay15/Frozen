import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[Category GET]", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser?.isAdmin && dbUser?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    // Simple create, no nested writes
    const category = await prisma.category.create({ data: { name } })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("[Category POST]", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
} 