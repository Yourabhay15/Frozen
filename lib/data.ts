import { prisma } from "./prisma"
import type { Product } from "./types"

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      discount: {
        select: {
          percentage: true,
        },
      },
    },
  });

  return products.map(p => ({
    ...p,
    category: p.category?.name,
    discount: p.discount?.percentage,
    material: p.material ?? null,
    care: p.care ?? null,
    origin: p.origin ?? null,
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      discount: {
        select: {
          percentage: true,
        },
      },
      reviews: true,
    },
  });

  if (!product) return null;

  return {
    ...product,
    category: product.category?.name,
    discount: product.discount?.percentage,
    material: product.material ?? null,
    care: product.care ?? null,
    origin: product.origin ?? null,
  } as Product;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  console.log("updateProduct received productData:", productData); // Log incoming productData
  const { category, discount, ...dataToUpdate } = productData;
  console.log("dataToUpdate:", dataToUpdate);
  console.log("category for connection:", category);
  console.log("discount for connection:", discount);

  // Correctly handle category connection: use categoryId from productData
  let categoryConnectData = {};
  if (productData.categoryId) {
    categoryConnectData = { category: { connect: { id: productData.categoryId } } };
  }

  // Handle discount connection (if applicable, assuming discount is a percentage number)
  let discountConnectData = {};
  if (productData.discount !== undefined && typeof productData.discount === 'number') {
    discountConnectData = { discount: { connect: { percentage: productData.discount } } };
  } else if (productData.discount === null) {
    // If discount is explicitly set to null, disconnect it
    discountConnectData = { discount: { disconnect: true } };
  }


  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...dataToUpdate,
      material: dataToUpdate.material,
      care: dataToUpdate.care,
      origin: dataToUpdate.origin,
      ...categoryConnectData, // Use the corrected category connection
      ...discountConnectData, // Use the corrected discount connection
    } as any, // Use 'any' temporarily to bypass complex Prisma type issues
    include: {
      category: true,
      discount: {
        select: {
          percentage: true,
        },
      },
    },
  });

  console.log("Prisma update result:", updatedProduct); // Log Prisma update result

  return {
    ...updatedProduct,
    category: updatedProduct.category?.name,
    discount: updatedProduct.discount?.percentage,
    material: updatedProduct.material ?? null,
    care: updatedProduct.care ?? null,
    origin: updatedProduct.origin ?? null,
  } as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await prisma.product.delete({ where: { id } })
  return !!deleted
}

// File system-based add/update/delete functions are disabled for client-side compatibility
// export async function addProduct(...) { /* ... */ }
// export async function updateProduct(...) { /* ... */ }
// export async function deleteProduct(...) { /* ... */ }
