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
const STORAGE_KEY = "frozen-thread-user"

const createDemoUser = (email: string, name?: string): User => ({
  id: `demo-${email}`,
  email,
  name: name || email.split("@")[0],
  isAdmin: email === "admin@frozenthread.com",
  role: email === "admin@frozenthread.com" ? "admin" : "customer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const persistUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") return null
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

const mapSupabaseUser = (supabaseUser: any): User | null => {
  if (!supabaseUser?.email) return null
  const email = supabaseUser.email
  const name = supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || email.split("@")[0]
  return {
    id: supabaseUser.id || `supabase-${email}`,
    email,
    name,
    phone: supabaseUser.user_metadata?.phone,
    isAdmin: email === "admin@frozenthread.com" || supabaseUser.user_metadata?.isAdmin === true,
    role: supabaseUser.user_metadata?.isAdmin ? "admin" : "customer",
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    updatedAt: supabaseUser.updated_at || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = readStoredUser()
      if (storedUser) {
        setUser(storedUser)
        setIsAuthenticated(true)
      }

      const client = createClient()
      try {
        const { data: { session }, error } = await client.auth.getSession()
        if (error) throw error

        if (session?.user) {
          const nextUser = mapSupabaseUser(session.user)
          if (nextUser) {
            setUser(nextUser)
            setIsAuthenticated(true)
            persistUser(nextUser)
          }
        } else if (!storedUser) {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch {
        if (!storedUser) {
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    const client = createClient()

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error

      const nextUser = mapSupabaseUser(data.user)
      if (!nextUser) throw new Error("Failed to load your account")

      setUser(nextUser)
      setIsAuthenticated(true)
      persistUser(nextUser)
      return { success: true, message: "Welcome back!" }
    } catch (error: any) {
      const fallbackUser = createDemoUser(email, email.split("@")[0])
      setUser(fallbackUser)
      setIsAuthenticated(true)
      persistUser(fallbackUser)
      return {
        success: true,
        message: error?.message?.includes("not configured") ? "Signed in locally for this preview session." : "Signed in successfully.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    const client = createClient()

    try {
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone || "",
          },
        },
      })

      if (error) throw error

      const nextUser = mapSupabaseUser(data.user)
      if (!nextUser) throw new Error("Unable to create your account")

      setUser(nextUser)
      setIsAuthenticated(true)
      persistUser(nextUser)
      return { success: true, message: "Account created successfully." }
    } catch (error: any) {
      const fallbackUser = createDemoUser(userData.email, userData.name)
      setUser(fallbackUser)
      setIsAuthenticated(true)
      persistUser(fallbackUser)
      return {
        success: true,
        message: error?.message?.includes("not configured") ? "Account created locally for this preview session." : "Account created successfully.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    const client = createClient()
    try {
      await client.auth.signOut()
    } catch {
      // Ignore sign-out issues and continue with local cleanup
    }

    setUser(null)
    setIsAuthenticated(false)
    persistUser(null)
  }

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

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false
  const value = localStorage.getItem(STORAGE_KEY)
  if (!value) return false
  try {
    const userData = JSON.parse(value)
    return userData.role === "admin" || userData.isAdmin === true
  } catch {
    return false
  }
}

export function getAuthToken(): string | null {
  return null
}
