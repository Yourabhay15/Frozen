"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Product, Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
}

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  inventory: string;
  status: "active" | "inactive";
  isNew: boolean;
  sizes: string[];
  images: string[];
};

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    inventory: "",
    status: "active",
    isNew: false,
    sizes: [],
    images: [],
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [newSize, setNewSize] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? (data.filter((cat: any) => cat && typeof cat.id === 'string' && typeof cat.name === 'string') as Category[]) : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId || (typeof product.category === "object" && product.category ? (product.category as Category).id : ""),
        inventory: product.inventory?.toString() || "",
        status: product.status as "active" | "inactive",
        isNew: product.isNew,
        sizes: product.sizes || [],
        images: product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"],
      })
    }
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.filename],
        }))
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.name || !formData.price || !formData.categoryId || !formData.inventory) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        inventory: Number.parseInt(formData.inventory),
        images: formData.images && formData.images.length > 0 ? formData.images : ["/placeholder.jpg"],
      }

      console.log("Product data being sent:", productData); // Log data being sent

      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      })

      console.log("API response:", response); // Log API response

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${product ? "updated" : "created"} successfully`,
        })
        onClose()
      } else {
        // Try to show backend error message
        let errorMsg = "Failed to save product"
        try {
          const err = await response.json()
          if (err && err.error) errorMsg = err.error
        } catch (e) {
          console.error("Failed to parse error response:", e); // Log error parsing issue
        }
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error); // Log general error
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={(e) => handleInputChange("inventory", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                  required
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories as Category[]).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => handleInputChange("isNew", checked)}
                />
                <Label htmlFor="isNew">Mark as New Product</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Sizes */}
            <div>
              <Label>Sizes</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add size (e.g., S, M, L, XL)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                />
                <Button type="button" onClick={addSize}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                    {size} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Product Images</Label>
              <div className="space-y-4">
                <div>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
