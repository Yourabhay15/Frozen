import { prisma } from "../lib/prisma"

async function seed() {
  try {
    // Seed categories
    const category = await prisma.category.upsert({
      where: { name: "Clothing" },
      update: {},
      create: { name: "Clothing" },
    })

    // Seed products (find by name, create if not exists)
    const existingProduct = await prisma.product.findFirst({ where: { name: "Basic T-Shirt" } })
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: "Basic T-Shirt",
          description: "A comfortable cotton t-shirt.",
          price: 19.99,
          categoryId: category.id,
          inventory: 100,
        },
      })
    }

    // Seed users
    await prisma.user.upsert({
      where: { email: "admin@frozenthread.com" },
      update: {},
      create: {
        email: "admin@frozenthread.com",
        password: "admin123", // In production, hash this!
        name: "Admin",
        isAdmin: true,
      },
    })

    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed() 