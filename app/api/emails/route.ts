import { type NextRequest, NextResponse } from "next/server"
import { createEmailNotification, markEmailAsSent } from "@/lib/database"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, type, subject, content } = body

    if (!userId || !type || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Users can only trigger emails for their own user ID, unless they are admin
    if (userId !== user.id) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      if (!dbUser?.isAdmin && dbUser?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const email = await createEmailNotification({
      userId,
      type,
      subject,
      content,
      sent: false,
    })

    // In a real app, you would send the email here using a service like SendGrid, Mailgun, etc.
    // For demo purposes, we'll just mark it as sent
    setTimeout(async () => {
      await markEmailAsSent(email.id)
    }, 1000)

    return NextResponse.json({ success: true, data: email }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create email notification" }, { status: 500 })
  }
}
