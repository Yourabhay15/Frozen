"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
// import { verifyPassword, createUser } from './database'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  isAdmin: boolean
  addresses?: Address[]
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

interface UserPreferences {
  newsletter: boolean
  smsUpdates: boolean
  preferredLanguage: string
  preferredCurrency: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>
  isLoading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("frozen-thread-user")
        const authToken = localStorage.getItem("frozen-thread-token")

        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser)
          // Verify token is still valid (in real app, you'd verify with server)
          const tokenData = JSON.parse(atob(authToken.split(".")[1]))
          const currentTime = Date.now() / 1000

          if (tokenData.exp > currentTime) {
            setUser(userData)
          } else {
            // Token expired, clear storage
            localStorage.removeItem("frozen-thread-user")
            localStorage.removeItem("frozen-thread-token")
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        localStorage.removeItem("frozen-thread-user")
        localStorage.removeItem("frozen-thread-token")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const generateToken = (user: User): string => {
    // Simple JWT-like token for demo (in production, use proper JWT library)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      }),
    )
    const signature = btoa("demo-signature") // In production, use proper HMAC

    return `${header}.${payload}.${signature}`
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate input
      if (!email || !password) {
        return { success: false, message: "Email and password are required" }
      }

      // Mock superuser credentials
      if (email === "admin@frozenthread.com" && password === "supersecret") {
        const adminUser: User = {
          id: "1",
          email,
          name: "Super Admin",
          isAdmin: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        const token = generateToken(adminUser)
        localStorage.setItem("frozen-thread-user", JSON.stringify(adminUser))
        localStorage.setItem("frozen-thread-token", token)
        setUser(adminUser)
        return { success: true, message: "Logged in as superuser!" }
      }

      // Optionally, handle other mock users here
      return { success: false, message: "Invalid email or password. Please try again." }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during sign in. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate input
      if (!userData.email || !userData.password || !userData.name) {
        return { success: false, message: "Name, email, and password are required" }
      }

      // Mock user registration for local dev
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const token = generateToken(newUser)
      localStorage.setItem("frozen-thread-user", JSON.stringify(newUser))
      localStorage.setItem("frozen-thread-token", token)
      setUser(newUser)
      return { success: true, message: "Account created successfully! (Mock)" }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, message: "An error occurred during registration. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("frozen-thread-user")
    localStorage.removeItem("frozen-thread-token")
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("frozen-thread-token")
}

// Helper function to check if user is admin
export function isAdmin(): boolean {
  if (typeof window === "undefined") return false
  const user = localStorage.getItem("frozen-thread-user")
  if (!user) return false
  try {
    const userData = JSON.parse(user)
    return userData.isAdmin === true
  } catch {
    return false
  }
}
