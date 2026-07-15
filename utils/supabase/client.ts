import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase is not configured") }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase is not configured") }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: null, error: new Error("Supabase is not configured") }),
        updateUser: async () => ({ data: { user: null }, error: new Error("Supabase is not configured") }),
      },
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
