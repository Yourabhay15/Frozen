import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all discounts
export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(discounts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discounts" }, { status: 500 })
  }
}

// Create a new discount
export async function POST(request: NextRequest) {
  try {
    const { name, percentage } = await request.json()
    if (!name || percentage == null) {
      return NextResponse.json({ error: "Name and percentage are required" }, { status: 400 })
    }
    const discount = await prisma.discount.create({
      data: { name, percentage },
    })
    return NextResponse.json(discount, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create discount" }, { status: 500 })
  }
} 