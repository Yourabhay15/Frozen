import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get a single discount
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const discount = await prisma.discount.findUnique({ where: { id } })
    if (!discount) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(discount)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discount" }, { status: 500 })
  }
}

// Update a discount
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, percentage } = await request.json()
    const discount = await prisma.discount.update({
      where: { id },
      data: { name, percentage },
    })
    return NextResponse.json(discount)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update discount" }, { status: 500 })
  }
}

// Delete a discount
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.discount.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete discount" }, { status: 500 })
  }
}