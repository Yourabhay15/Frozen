"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus, X } from "lucide-react"

interface Discount {
  id: string
  name: string
  percentage: number
  active: boolean
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", percentage: "", active: true })
  const [editing, setEditing] = useState<Discount | null>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    setLoading(true)
    const res = await fetch("/api/discounts")
    const data = await res.json()
    setDiscounts(data)
    setLoading(false)
  }

  const handleAdd = () => {
    setEditing(null)
    setForm({ name: "", percentage: "", active: true })
    setShowForm(true)
  }

  const handleEdit = (discount: Discount) => {
    setEditing(discount)
    setForm({ name: discount.name, percentage: discount.percentage.toString(), active: discount.active })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount?")) return
    await fetch(`/api/discounts/${id}`, { method: "DELETE" })
    fetchDiscounts()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.percentage) return
    const payload = { name: form.name, percentage: parseFloat(form.percentage), active: form.active }
    if (editing) {
      await fetch(`/api/discounts/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }
    setShowForm(false)
    fetchDiscounts()
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Discounts Management</h1>
      <Button onClick={handleAdd} className="mb-4"><Plus className="mr-2 h-4 w-4" />Add Discount</Button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/10">
              {discounts.map((discount) => (
                <li key={discount.id} className="flex items-center justify-between py-2">
                  <span>{discount.name} ({discount.percentage}%){!discount.active && <span className="ml-2 text-xs text-gray-400">(Inactive)</span>}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(discount)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(discount.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editing ? "Edit" : "Add"} Discount</h2>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Discount name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                autoFocus
              />
              <Input
                placeholder="Percentage"
                type="number"
                min="0"
                max="100"
                value={form.percentage}
                onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))}
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                />
                Active
              </label>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 