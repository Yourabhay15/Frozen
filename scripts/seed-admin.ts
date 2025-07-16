import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@frozenthread.com"
  const password = "admin123" // This is the plain text password

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log("Admin user already exists. Updating password if necessary.")
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })
      console.log("Admin user password updated.")
    } else {
      // Create the admin user
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Admin User",
          isAdmin: true,
          role: "admin",
        },
      })
      console.log("Admin user created successfully.")
    }
  } catch (e) {
    console.error("Error seeding admin user:", e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()