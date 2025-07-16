"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus, X } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState("")
  const [editing, setEditing] = useState<Category | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  const handleAdd = () => {
    setEditing(null)
    setFormName("")
    setShowForm(true)
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setFormName(cat.name)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    setActionLoading(true)
    setActionMessage(null)
    setActionError(null)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete category")
      setActionMessage("Category deleted successfully.")
      fetchCategories()
    } catch (err: unknown) {
      setActionError("Failed to delete category.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formName.trim()) return
    setActionLoading(true)
    setActionMessage(null)
    setActionError(null)
    try {
      if (editing) {
        const res = await fetch(`/api/categories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName }),
        })
        if (!res.ok) throw new Error("Failed to update category")
        setActionMessage("Category updated successfully.")
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName }),
        })
        if (!res.ok) throw new Error("Failed to add category")
        setActionMessage("Category added successfully.")
      }
      setShowForm(false)
      fetchCategories()
    } catch (err: unknown) {
      setActionError(editing ? "Failed to update category." : "Failed to add category.")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
      <Button onClick={handleAdd} className="mb-4"><Plus className="mr-2 h-4 w-4" />Add Category</Button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/10">
              {Array.isArray(categories) && categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between py-2">
                  <span>{cat.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4" /></Button>
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
              <h2 className="text-lg font-bold">{editing ? "Edit" : "Add"} Category</h2>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)} disabled={actionLoading}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Category name"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                required
                autoFocus
                disabled={actionLoading}
              />
              <Button type="submit" className="w-full" disabled={actionLoading}>{actionLoading ? "Saving..." : editing ? "Update" : "Add"}</Button>
              {actionError && <div className="text-red-500 text-sm mt-2">{actionError}</div>}
              {actionMessage && <div className="text-green-500 text-sm mt-2">{actionMessage}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 