import { type NextRequest, NextResponse } from "next/server"
import { getUsers, createUser, getUserByEmail } from "@/lib/database"

export async function GET() {
  try {
    const users = await getUsers()
    // Remove sensitive information
    const safeUsers = users.map(({ ...user }) => ({
      ...user,
    }))
    return NextResponse.json({ success: true, data: safeUsers })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Validate required fields
    if (!userData.email || !userData.name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const user = await createUser({
      ...userData,
      isAdmin: userData.isAdmin || false,
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
