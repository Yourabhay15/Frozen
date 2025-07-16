import { testConnection, initializeDatabase, seedDatabase } from "../lib/neon-database"

async function startApplication() {
  console.log("🧊 FROZEN THREAD - Starting Application")
  console.log("======================================")
  console.log("")

  try {
    // Check environment variables
    console.log("📋 Checking environment variables...")

    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is missing!")
      console.log("")
      console.log("🔧 Quick fix:")
      console.log("1. Add your Neon database URL to .env.local")
      console.log("2. Run 'npm run setup' for complete setup")
      console.log("")
      process.exit(1)
    }

    if (!process.env.NEXTAUTH_SECRET) {
      console.error("❌ NEXTAUTH_SECRET is missing!")
      console.log("Add NEXTAUTH_SECRET to your .env.local file")
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
      console.log("• Verify Neon project is active")
      console.log("")
      process.exit(1)
    }

    console.log("✅ Database connection successful")
    console.log("")

    // Check if tables exist
    console.log("🗄️  Checking database tables...")
    try {
      const { sql } = await import("../lib/neon-database")
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      `

      if (tables.length === 0) {
        console.log("⚠️  Database tables not found. Initializing...")

        const initialized = await initializeDatabase()
        if (!initialized) {
          console.error("❌ Failed to initialize database")
          process.exit(1)
        }

        console.log("✅ Database tables created")
        console.log("")

        console.log("🌱 Adding sample data...")
        await seedDatabase()
        console.log("✅ Sample data added")
      } else {
        console.log("✅ Database tables exist")
      }
    } catch (error) {
      console.log("⚠️  Could not check tables, but connection works")
    }

    console.log("")
    console.log("🎉 Application ready to start!")
    console.log("")
    console.log("🌐 Access points:")
    console.log("   Frontend:        http://localhost:3000")
    console.log("   Admin Dashboard: http://localhost:3000/admin")
    console.log("   API:            http://localhost:3000/api")
    console.log("")
    console.log("👤 Demo accounts:")
    console.log("   Admin:    admin@frozenthread.com    / admin123")
    console.log("   User:     user@frozenthread.com     / user123")
    console.log("   Customer: customer@frozenthread.com / customer123")
    console.log("")
    console.log("🚀 Run 'npm run dev' to start the development server")
    console.log("")
  } catch (error) {
    console.error("❌ Startup failed:", error)
    console.log("")
    console.log("🆘 Get help:")
    console.log("• Run 'npm run help' for complete guide")
    console.log("• Run 'npm run status' to check system")
    console.log("• Run 'npm run db:test' to test database")
    console.log("")
    process.exit(1)
  }
}

startApplication()
