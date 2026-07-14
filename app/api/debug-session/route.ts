import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { session }, error } = await supabase.auth.getSession()
    return NextResponse.json({ session, error })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}