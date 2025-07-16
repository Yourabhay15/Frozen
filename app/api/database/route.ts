import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"

// Database backup and restore functionality
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataPath = path.join(process.cwd(), "data", "products.json")
    const data = await fs.readFile(dataPath, "utf8")

    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="frozen-thread-backup-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const dataPath = path.join(process.cwd(), "data", "products.json")

    // Validate data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))

    return NextResponse.json({ message: "Database restored successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to restore database" }, { status: 500 })
  }
}
