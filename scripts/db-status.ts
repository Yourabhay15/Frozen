import { checkDatabaseHealth, getDatabaseStats } from "../lib/database"

async function main() {
  console.log("🧊 FROZEN THREAD - PostgreSQL Status\n==============================\n")
  const healthy = await checkDatabaseHealth()
  console.log(`PostgreSQL Connection: ${healthy ? "✅ Healthy" : "❌ Unhealthy"}`)

  if (healthy) {
    const stats = await getDatabaseStats()
    console.log("\n📊 Database Stats:")
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`)
    })
  }
}

main() 