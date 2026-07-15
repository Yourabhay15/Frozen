"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, X, User, Heart, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/logo"
import CartSidebar from "@/components/cart/cart-sidebar"
import Link from "next/link"
import SearchBar from "@/components/search/search-bar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  // Add state for wishlist count
  const [wishlistCount, setWishlistCount] = useState(0)

  // Get current path for aria-current
  const [currentPath, setCurrentPath] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname + window.location.search)
    }
  }, [])

  // Add useEffect to fetch wishlist count
  useEffect(() => {
    if (user) {
      fetchWishlistCount()
    }
  }, [user])

  const fetchWishlistCount = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}`, {
        credentials: "include", // Ensure cookies are sent with the request
      })
      const data = await response.json()
      if (data.success) {
        setWishlistCount(data.data.length)
      }
    } catch (error) {
      console.error("Failed to fetch wishlist count:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Cartoon Caus", href: "/?category=Cartoon Caus MERCH" },
    { name: "Harry Potter", href: "/?category=Harry Potter MERCH" },
    { name: "Spooky", href: "/?category=Spooky MERCH" },
    { name: "Anime", href: "/?category=Anime MERCH" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Sale", href: "/?sale=true" },
  ]

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10 bg-black/90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo className="hover:scale-105 transition-transform" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors relative group focus:outline-none focus:ring-2 focus:ring-white"
                aria-current={currentPath === item.href ? "page" : undefined}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <SearchBar className="hidden md:flex max-w-sm" />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none" asChild aria-label="Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5 text-gray-300" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">{wishlistCount}</Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <CartSidebar />

            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/10">
                    <User className="h-5 w-5 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/20 bg-black">
                  <DropdownMenuItem className="text-white">
                    <User className="mr-2 h-4 w-4" />
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-400 text-xs">{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="text-white hover:text-gray-300">
                      <Settings className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-white hover:text-gray-300">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-white hover:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10" id="mobile-menu">
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={currentPath === item.href ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Search - replace the existing mobile search form */}
            <div className="mt-4">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-white focus:outline-none">Skip to main content</a>
      </div>
    </header>
  )
}
