"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  isAdmin: boolean
  role: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
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

const supabase = createClient()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      try {
        const { data: { user: sbUser } } = await supabase.auth.getUser()
        if (sbUser && isMounted) {
          // Fetch database profile
          const response = await fetch(`/api/auth/profile`)
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setUser(data.data)
              localStorage.setItem("frozen-thread-user", JSON.stringify(data.data))
            } else {
              setUser(null)
              localStorage.removeItem("frozen-thread-user")
            }
          }
        } else if (isMounted) {
          setUser(null)
          localStorage.removeItem("frozen-thread-user")
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/auth/profile`)
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setUser(data.data)
              localStorage.setItem("frozen-thread-user", JSON.stringify(data.data))
            }
          }
        } catch (error) {
          console.error("Failed to sync auth profile:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        localStorage.removeItem("frozen-thread-user")
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, message: "Welcome back!" }
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to log in" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          }
        }
      })
      if (error) throw error
      return { success: true, message: "Account created successfully! Please check your email or sign in." }
    } catch (error: any) {
      return { success: false, message: error.message || "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
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

// Helper function to check if user is admin
export function isAdmin(): boolean {
  if (typeof window === "undefined") return false
  const user = localStorage.getItem("frozen-thread-user")
  if (!user) return false
  try {
    const userData = JSON.parse(user)
    return userData.role === "admin" || userData.isAdmin === true
  } catch {
    return false
  }
}

// Helper function to get auth token (compatibility)
export function getAuthToken(): string | null {
  return null
}
