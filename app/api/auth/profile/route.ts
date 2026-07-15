import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    let profile = await prisma.user.findUnique({
      where: { id: user.id },
    })
    
    if (!profile) {
      // Auto-create profile if it doesn't exist yet
      profile = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || null,
          role: user.email === "admin@frozenthread.com" ? "admin" : "customer",
          isAdmin: user.email === "admin@frozenthread.com",
        },
      })
    }
    
    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, role } = body
    
    const profile = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: name !== undefined ? name : undefined,
        role: role !== undefined ? role : undefined,
        isAdmin: role === "admin" ? true : undefined,
      },
      create: {
        id: user.id,
        email: user.email!,
        name: name || user.user_metadata?.name || null,
        role: role || (user.email === "admin@frozenthread.com" ? "admin" : "customer"),
        isAdmin: role === "admin" || user.email === "admin@frozenthread.com",
      },
    })
    
    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    console.error("Profile POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
