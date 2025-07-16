import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth" // Import getServerSession
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Import authOptions

export async function GET(request: NextRequest) { // Add request parameter
  try {
    const session = await getServerSession(authOptions) // Get session

    // For GET requests, allow access to all users.
    // Products displayed on the homepage should be publicly accessible.
    console.log("API: Attempting to fetch active products for public view...");
    const products = await prisma.product.findMany({ where: { status: "active" } });
    console.log("API: Successfully fetched active products, count:", products.length);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API: Error fetching products:", error);
    // Log the full error object for more details
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
    const session = await getServerSession(authOptions) // Get session

    // Check if user is authenticated and is an admin
    if (!(session?.user?.isAdmin || session?.user?.role === "admin")) {
      console.warn("API: Unauthorized attempt to create product (POST)");
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
    console.error("API: Error creating product:", error); // Add logging for POST errors
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
