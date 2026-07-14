import { testConnection } from "../lib/database"

async function checkStatus() {
  console.log("🧊 FROZEN THREAD - System Status")
  console.log("=================================")
  console.log("")

  // Check environment variables
  console.log("📋 Environment Variables:")
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}`)
  console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}`)
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing"}`)
  console.log("")

  // Check database connection
  console.log("🔌 Database Connection:")
  try {
    if (process.env.DATABASE_URL) {
      const isConnected = await testConnection()
      console.log(`   Connection: ${isConnected ? "✅ Active" : "❌ Failed"}`)
    } else {
      console.log("   Connection: ❌ No DATABASE_URL")
    }
  } catch (error) {
    console.log("   Connection: ❌ Error")
  }
  console.log("")

  // Check Node.js version
  console.log("🔧 System Info:")
  console.log(`   Node.js: ${process.version}`)
  console.log(`   Platform: ${process.platform}`)
  console.log("")

  // Next steps
  console.log("🚀 Quick Actions:")
  console.log("   npm run help     - Show help menu")
  console.log("   npm run setup    - Complete setup")
  console.log("   npm run dev      - Start development")
  console.log("   npm run db:test  - Test database")
  console.log("")
}

checkStatus()
