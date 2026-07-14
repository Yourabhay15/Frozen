import { testConnection } from "../lib/database"

async function startApplication() {
  console.log("🧊 FROZEN THREAD - Starting Application")
  console.log("======================================")
  console.log("")

  try {
    console.log("📋 Checking environment variables...")

    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is missing!")
      console.log("")
      console.log("🔧 Quick fix:")
      console.log("1. Add your Supabase PostgreSQL connection string to .env.local")
      console.log("2. Run 'npx prisma db push' to synchronize schema")
      console.log("")
      process.exit(1)
    }

    console.log("✅ Environment variables configured")
    console.log("")

    // Test database connection
    console.log("🔌 Testing database connection...")
    const isConnected = await testConnection()

    if (!isConnected) {
      console.error("❌ Database connection failed!")
      console.log("")
      console.log("🔧 Troubleshooting:")
      console.log("• Run 'npm run db:test' to diagnose")
      console.log("• Check your DATABASE_URL format")
      console.log("• Verify Supabase database is active")
      console.log("")
      process.exit(1)
    }

    console.log("✅ Database connection successful")
    console.log("")

    // Check if tables exist
    console.log("🗄️  Checking database tables...")
    try {
      const { prisma } = await import("../lib/prisma")
      await prisma.user.findFirst()
      console.log("✅ Database tables exist")
    } catch (error) {
      console.log("⚠️  Database tables not found. Initializing...")
      console.log("👉 Please run 'npx prisma db push' to create tables, and 'npm run db:seed' to seed.")
    }

    console.log("")
    console.log("🎉 Application ready to start!")
    console.log("")
    console.log("🌐 Access points:")
    console.log("   Frontend:        http://localhost:3000")
    console.log("   Admin Dashboard: http://localhost:3000/admin")
    console.log("   API:            http://localhost:3000/api")
    console.log("")
    console.log("🚀 Run 'npm run dev' to start the development server")
    console.log("")
  } catch (error) {
    console.error("❌ Startup failed:", error)
    process.exit(1)
  }
}

startApplication()
