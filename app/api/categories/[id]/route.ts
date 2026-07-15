import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get a single category
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

// Update a category
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name } = await request.json()
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// Delete a category
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}