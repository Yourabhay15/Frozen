import { checkMongoHealth, getDatabaseStats } from "../lib/database"

async function main() {
  console.log("🧊 FROZEN THREAD - MongoDB Status\n==============================\n")
  const healthy = await checkMongoHealth()
  console.log(`MongoDB Connection: ${healthy ? "✅ Healthy" : "❌ Unhealthy"}`)

  if (healthy) {
    const stats = await getDatabaseStats()
    console.log("\n📊 Database Stats:")
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`)
    })
  }
}

main() 