import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      isAdmin: boolean
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    isAdmin: boolean
    role: string
    accessToken?: string // Add accessToken to Session.user
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string | null
    isAdmin: boolean
    role: string
    accessToken?: string // Add accessToken to JWT
  }
}