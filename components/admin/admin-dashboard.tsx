"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, TrendingUp, IndianRupee } from "lucide-react"
import { getProducts } from "@/lib/data"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatPriceCompact } from "@/lib/currency"

type TopProduct = { name: string; sales: number }

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [salesStats, setSalesStats] = useState<{
    totalSales: number
    totalRevenue: number
    ordersCount: number
    topProducts: TopProduct[]
  }>({
    totalSales: 0,
    totalRevenue: 0,
    ordersCount: 0,
    topProducts: [],
  })
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Fetch real analytics data from backend
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/db/analytics")
        if (!res.ok) throw new Error("Failed to fetch analytics")
        const { analytics } = await res.json()
        setSalesStats(analytics)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      }
    }
    fetchAnalytics()
  }, [])

  useEffect(() => {
    // Fetch users for admin management
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/db/users")
        if (!res.ok) throw new Error("Failed to fetch users")
        const { users } = await res.json()
        setUsers(users)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => p.inventory === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.inventory, 0),
    newProducts: products.filter((p) => p.isNew).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pulse-glow p-8 rounded-lg glass">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage your FROZEN THREAD store</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/admin/products">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalProducts}</div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-green-400">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.activeProducts}</div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-green-400">+5%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Out of Stock</CardTitle>
              <Package className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.outOfStock}</div>
              <p className="text-xs text-slate-400 mt-1">{stats.outOfStock > 0 ? "Needs attention" : "All stocked"}</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Inventory Value</CardTitle>
              <IndianRupee className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatPriceCompact(stats.totalValue)}</div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-green-400">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{salesStats.totalSales}</div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-green-400">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{salesStats.ordersCount}</div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-green-400">+10%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales/Revenue Chart Placeholder */}
        <div className="mb-8">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Sales & Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-slate-400">
                {/* TODO: Replace with real chart */}
                <span>Chart coming soon...</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Placeholder */}
        <div className="mb-8">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300">
                {salesStats.topProducts.map((prod, idx) => (
                  <li key={idx} className="flex justify-between py-1">
                    <span>{prod.name}</span>
                    <span className="font-bold">{prod.sales}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                New Products
                <Badge className="bg-green-500">{stats.newProducts}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Products marked as new arrivals</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                On Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Products with active discounts</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Categories
                <Badge className="bg-blue-500">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Men, Women, Accessories</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-white/10 hover-lift">
            <CardHeader>
              <CardTitle className="text-white">Product Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/admin/products">
                  <Package className="mr-2 h-4 w-4" />
                  Manage All Products
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full glass border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/admin/products?action=add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 hover-lift">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">5 new products added today</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">2 products low on stock</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Winter sale started</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="mb-12">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="text-slate-400">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-slate-200">
                    <thead>
                      <tr className="bg-slate-800">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Admin</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700">
                          <td className="px-4 py-2">{user.name || <span className="italic text-slate-400">No name</span>}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">{user.isAdmin ? <span className="text-green-400 font-bold">Yes</span> : "No"}</td>
                          <td className="px-4 py-2">
                            {/* Placeholder for future actions */}
                            <span className="text-slate-400">-</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
