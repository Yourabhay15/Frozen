"use client"

import ProtectedRoute from "@/components/admin/protected-route"
import AdminDashboard from "@/components/admin/admin-dashboard"
import Link from "next/link"

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen">
        <div className="min-h-screen flex">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            <nav className="flex flex-col space-y-2">
              <Link href="/admin/products" className="hover:bg-gray-800 rounded px-3 py-2">Products</Link>
              <Link href="/admin/categories" className="hover:bg-gray-800 rounded px-3 py-2">Categories</Link>
              <Link href="/admin/inventory" className="hover:bg-gray-800 rounded px-3 py-2">Inventory</Link>
              <Link href="/admin/discounts" className="hover:bg-gray-800 rounded px-3 py-2">Discounts</Link>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1 p-8 bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
            <p className="text-lg text-gray-300">Select a section from the sidebar to manage your store.</p>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
