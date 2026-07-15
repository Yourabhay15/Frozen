"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Save } from "lucide-react"

interface Product {
  id: string
  name: string
  inventory: number
  sku: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inventoryValue, setInventoryValue] = useState<string>("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      // Sort products by name for consistency
      const sorted = Array.isArray(data) ? data.sort((a, b) => a.name.localeCompare(b.name)) : []
      setProducts(sorted)
    } catch (e) {
      console.error("Failed to fetch inventory:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setInventoryValue(product.inventory.toString())
  }

  const handleSave = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory: parseInt(inventoryValue, 10) }),
      })
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      console.error("Failed to update inventory:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading products...</div>
      ) : (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Products Stock Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/10">
              {products.length === 0 ? (
                <li className="py-4 text-center text-slate-500">No products found.</li>
              ) : (
                products.map((product) => (
                  <li key={product.id} className="flex items-center justify-between py-3 gap-4">
                    <span className="flex-grow text-white font-medium">
                      {product.name} 
                      {product.sku && <span className="text-xs text-gray-500 ml-2">({product.sku})</span>}
                    </span>
                    
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={inventoryValue}
                          onChange={e => setInventoryValue(e.target.value)}
                          className="w-24 bg-black/50 border-white/20 text-white"
                        />
                        <Button size="sm" variant="default" className="btn-premium" onClick={() => handleSave(product.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/15 text-slate-400" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className={`font-semibold min-w-[32px] text-right ${product.inventory === 0 ? "text-red-500 font-bold" : "text-slate-300"}`}>
                          {product.inventory} pcs
                        </span>
                        <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10 text-white" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="bg-red-900/60 hover:bg-red-800 text-white" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}