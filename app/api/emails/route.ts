import { type NextRequest, NextResponse } from "next/server"
import { createEmailNotification, markEmailAsSent } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, subject, content } = body

    if (!userId || !type || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
