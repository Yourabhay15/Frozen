import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("API: Attempting to fetch active products for public view...");
    const products = await prisma.product.findMany({ where: { status: "active" } });
    console.log("API: Successfully fetched active products, count:", products.length);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API: Error fetching products:", error);
    if (error instanceof Error) {
      console.error("API: Error name:", error.name);
      console.error("API: Error message:", error.message);
      console.error("API: Error stack:", error.stack);
    }
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.warn("API: Unauthorized attempt to create product (POST) - No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin in Prisma database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser?.isAdmin && dbUser?.role !== "admin") {
      console.warn(`API: Unauthorized attempt to create product (POST) - User ${user.email} is not admin`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()
    if (!productData.categoryId) {
      return NextResponse.json({ error: "categoryId is required" }, { status: 400 })
    }
    // Remove all fields not in the Prisma Product model
    const { sku, stock, discount, status, isNew, sizes, images, ...productDataClean } = productData
    // Ensure images is always an array with at least one image
    const imagesArray = Array.isArray(images) && images.length > 0 ? images : ["/placeholder.jpg"]
    const newProduct = await prisma.product.create({
      data: {
        ...productDataClean,
        images: imagesArray,
      },
    })
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("API: Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
