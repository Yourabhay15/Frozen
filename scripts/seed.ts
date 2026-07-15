import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seeding of Frozen Thread original products...")
  try {
    // 1. Create or get categories
    const categoriesData = [
      { name: "Cartoon Caus MERCH" },
      { name: "Harry Potter MERCH" },
      { name: "Spooky MERCH" },
      { name: "Anime MERCH" },
    ]

    const categories: Record<string, any> = {}
    for (const cat of categoriesData) {
      const created = await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: { name: cat.name },
      })
      categories[cat.name] = created
      console.log(`📁 Category: "${created.name}" (ID: ${created.id})`)
    }

    // 2. Clear old products to avoid duplicates
    console.log("🗑️ Clearing existing products...")
    await prisma.product.deleteMany()

    // 3. Products list matching MHTML
    const productsData = [
      {
        name: "Stitch  Art",
        categoryName: "Cartoon Caus MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777226512/Picsart_25-06-14_12-53-06-933_e8rs9h.jpg",
        description: "Premium Stitch Art oversized streetwear t-shirt. Crafted from 100% heavy cotton for ultimate comfort and durability.",
        inventory: 50,
      },
      {
        name: "Demon Slayer - Tanjiro",
        categoryName: "Anime MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777226512/mm11_woewdl.jpg",
        description: "Demon Slayer Tanjiro graphic print oversized streetwear t-shirt. High-quality print inspired by your favorite slayer.",
        inventory: 50,
      },
      {
        name: "Porsche",
        categoryName: "Cartoon Caus MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777226511/Picsart_25-07-04_18-26-25-733_ruhamn.jpg",
        description: "Porsche vintage-style graphic oversized t-shirt. Sleek design for automotive and streetwear enthusiasts.",
        inventory: 50,
      },
      {
        name: "Harry Potter HOGWARTS",
        categoryName: "Harry Potter MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/f_auto,q_auto,w_400/v1753005294/Picsart_25-06-28_13-07-29-502_cjxnag.jpg",
        description: "Harry Potter Hogwarts crest oversized streetwear t-shirt. Carry the magic of the school of witchcraft and wizardry.",
        inventory: 50,
      },
      {
        name: "OnePiece - ZORO",
        categoryName: "Anime MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777226511/A_White_Back_1_r1emf7.jpg",
        description: "One Piece Roronoa Zoro dynamic print oversized streetwear t-shirt. Unleash the power of the three-sword style.",
        inventory: 50,
      },
      {
        name: "Spooky Ghost Diffy the Oddy",
        categoryName: "Spooky MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/f_auto,q_auto,w_400/v1753005550/Picsart_25-05-30_14-29-30-555_sxwf4o.jpg",
        description: "Spooky Ghost Diffy the Oddy cute and spooky graphic oversized t-shirt. Stand out with unique quirky art.",
        inventory: 50,
      },
      {
        name: "OnePiece - LUFFYd",
        categoryName: "Anime MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777226512/mm1_pcwlf5.jpg",
        description: "One Piece Monkey D. Luffy gear style print oversized streetwear t-shirt. High-definition graphic print.",
        inventory: 50,
      },
      {
        name: "Dare to Disturb",
        categoryName: "Spooky MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777227251/Picsart_25-06-14_17-32-44-477_xgub67.jpg",
        description: "Dare to Disturb dark aesthetic graphic oversized t-shirt. Perfect statement piece for an edgy streetwear look.",
        inventory: 50,
      },
      {
        name: "PowerPuff Girls",
        categoryName: "Cartoon Caus MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/v1777227251/gf3_atq9jj.jpg",
        description: "Custom PowerPuff Girls graphic print oversized t-shirt. Nostalgic cartoon style blended with modern streetwear fits.",
        inventory: 50,
      },
      {
        name: "Cartoon  Caus",
        categoryName: "Cartoon Caus MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/f_auto,q_auto,w_400/v1753005295/Picsart_25-05-30_00-42-41-167_1_sq1mdw.jpg",
        description: "Cartoon Caus print oversized streetwear t-shirt. Playful cartoon aesthetics meets high-quality fabric.",
        inventory: 50,
      },
      {
        name: "SPOOKY Ghost Smoking Kills",
        categoryName: "Spooky MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/f_auto,q_auto,w_400/v1753005550/Picsart_25-05-30_14-29-30-555_sxwf4o.jpg",
        description: "SPOOKY Ghost Smoking Kills custom graphic oversized t-shirt. Dark humor and bold street art combined.",
        inventory: 50,
      },
      {
        name: "FT Comic",
        categoryName: "Cartoon Caus MERCH",
        price: 999,
        image: "https://res.cloudinary.com/dpof6jswm/image/upload/f_auto,q_auto,w_400/v1753005295/Picsart_25-05-30_00-42-41-167_1_sq1mdw.jpg",
        description: "Frozen Thread Comic strip graphic oversized t-shirt. Unique hand-drawn comic style on premium fabric.",
        inventory: 50,
      },
    ]

    for (const prod of productsData) {
      const category = categories[prod.categoryName]
      if (!category) continue
      
      const createdProduct = await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image: prod.image,
          categoryId: category.id,
          inventory: prod.inventory,
          images: [prod.image],
          sizes: ["S", "M", "L", "XL", "XXL"],
          material: "100% Cotton",
          care: "Hand wash cold, hang dry",
          origin: "Made in India",
          status: "active",
        },
      })
      console.log(`👕 Product created: "${createdProduct.name}" in category "${prod.categoryName}"`)
    }

    // 4. Seed users if not exists
    await prisma.user.upsert({
      where: { email: "admin@frozenthread.com" },
      update: {},
      create: {
        id: "mock-admin-id",
        email: "admin@frozenthread.com",
        password: "admin123",
        name: "Admin User",
        isAdmin: true,
        role: "admin",
      },
    })
    console.log("👤 Admin user seeded successfully")

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()