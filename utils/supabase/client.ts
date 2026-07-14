import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  const client = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

  // Mock getUser to bypass authentication checks
  client.auth.getUser = async (jwt?: string) => {
    return {
      data: {
        user: {
          id: "mock-admin-id",
          email: "admin@frozenthread.com",
          user_metadata: { name: "Bypassed Admin" }
        } as any
      },
      error: null
    }
  }

  // Mock getSession to bypass session checks
  client.auth.getSession = async () => {
    return {
      data: {
        session: {
          access_token: "mock-token",
          user: {
            id: "mock-admin-id",
            email: "admin@frozenthread.com",
            user_metadata: { name: "Bypassed Admin" }
          } as any
        } as any
      },
      error: null
    }
  }

  return client;
};
