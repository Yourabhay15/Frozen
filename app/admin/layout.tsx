"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/admin/protected-route"
import { LayoutDashboard, Package, FolderHeart, ShieldAlert, BadgePercent, ArrowLeft } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderHeart },
    { name: "Inventory", href: "/admin/inventory", icon: ShieldAlert },
    { name: "Discounts", href: "/admin/discounts", icon: BadgePercent },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex bg-slate-950 text-white">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col p-6 space-y-6 shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-widest text-white stage-wander">ADMIN PANEL</h2>
            <p className="text-xs text-gray-500 mt-1 tracking-wider copperplate-bold">FROZEN THREAD</p>
          </div>
          
          <nav className="flex flex-col space-y-1 flex-grow">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-lg shadow-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Back to Storefront button */}
          <Link 
            href="/" 
            className="mt-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2.5 transition-all active:scale-95 text-center font-medium text-sm btn-premium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Storefront
          </Link>
        </aside>
        
        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
