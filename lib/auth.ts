import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// This file is no longer needed for authOptions as it's now defined in app/api/auth/[...nextauth]/route.ts
// import type { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Simple hardcoded user for demo
//         if (
//           credentials?.email === "admin@frozenthread.com" &&
//           (credentials?.password === "admin123" || credentials?.password === "supersecret")
//         ) {
//           return {
//             id: "1",
//             email: "admin@frozenthread.com",
//             name: "Admin User",
//             isAdmin: true,
//             role: "admin", // Add the missing role property
//           }
//         }
//         return null
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.isAdmin = (user as any).isAdmin
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         ;(session.user as any).isAdmin = token.isAdmin
//         ;(session.user as any).role = token.role // Ensure role is propagated to session
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   cookies: {
//     sessionToken: {
//       name: `next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Use the secret from .env
// }
