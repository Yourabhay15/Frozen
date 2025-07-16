"use client"

import ProtectedRoute from "@/components/admin/protected-route"
import ProductManagement from "@/components/admin/product-management"

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen">
        <ProductManagement />
      </div>
    </ProtectedRoute>
  )
}
