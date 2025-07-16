"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "@/components/loading"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin")
        return
      }

      if (requireAdmin && !user?.isAdmin) {
        router.push("/")
        return
      }
    }
  }, [user, isLoading, isAuthenticated, requireAdmin, router])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Loading />
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Loading />
  }

  return <>{children}</>
}
