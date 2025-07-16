"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Save } from "lucide-react"

interface Product {
  id: string
  name: string
  stock: number
  sku: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState<string>("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setStockValue(product.stock.toString())
  }

  const handleSave = async (id: string) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: parseInt(stockValue, 10) }),
    })
    setEditingId(null)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    fetchProducts()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Products Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/10">
              {products.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-2 gap-2">
                  <span className="flex-1">{product.name} <span className="text-xs text-gray-400 ml-2">({product.sku})</span></span>
                  {editingId === product.id ? (
                    <>
                      <Input
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={e => setStockValue(e.target.value)}
                        className="w-24"
                      />
                      <Button size="sm" variant="default" onClick={() => handleSave(product.id)}><Save className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span className={product.stock === 0 ? "text-red-600 font-bold" : ""}>{product.stock}</span>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 