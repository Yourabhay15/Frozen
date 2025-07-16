import { promises as fs } from "fs"
import path from "path"

async function setupProject() {
  console.log("🚀 Setting up FROZEN THREAD e-commerce platform...")

  try {
    // Create data directory and initialize files
    console.log("📁 Creating data directory...")
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Create uploads directory
    console.log("📁 Creating uploads directory...")
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    console.log("✅ Setup complete!")
    console.log("")
    console.log("🎉 Your FROZEN THREAD e-commerce platform is ready!")
    console.log("")
    console.log("📋 Demo accounts:")
    console.log("   Admin: admin@frozenthread.com / admin123")
    console.log("   User: user@frozenthread.com / user123")
    console.log("   Customer: customer@frozenthread.com / customer123")
    console.log("")
    console.log('🚀 Run "npm run dev" to start the development server')
  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  }
}

setupProject()
