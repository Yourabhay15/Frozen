"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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

const mockUser: User = {
  id: "mock-admin-id",
  email: "admin@frozenthread.com",
  name: "Bypassed Admin",
  isAdmin: true,
  role: "admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("frozen-thread-user", JSON.stringify(mockUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return { success: true, message: "Welcome back, Bypassed Admin!" }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    return { success: true, message: "Account created successfully!" }
  }

  const logout = async () => {
    // Keep auth bypassed
  }

  const isAuthenticated = true

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
