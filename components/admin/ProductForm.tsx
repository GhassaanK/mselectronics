"use client"

import { useMemo, useState, type FormEvent } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createProduct, updateProduct } from "@/lib/firebase/admin-products"
import type { ProductAvailability, ProductBadge, ProductImage, SerializableProduct } from "@/types"

type ProductFormProps = {
  mode?: "Create" | "Update"
  initialProduct?: SerializableProduct | null
}

export function ProductForm({ mode = "Create", initialProduct }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name || "")
  const [brand, setBrand] = useState(initialProduct?.brand || "")
  const [category, setCategory] = useState(initialProduct?.category || "")
  const [price, setPrice] = useState(String(initialProduct?.price || ""))
  const [originalPrice, setOriginalPrice] = useState(String(initialProduct?.originalPrice || ""))
  const [availability, setAvailability] = useState<ProductAvailability>(initialProduct?.availability || "In Stock")
  const [featured, setFeatured] = useState(Boolean(initialProduct?.featured))
  const [badge, setBadge] = useState<ProductBadge | "">(initialProduct?.badge || "")
  const [specsText, setSpecsText] = useState(Object.entries(initialProduct?.specs || {}).map(([key, value]) => `${key}: ${value}`).join("\n"))
  const [featuresText, setFeaturesText] = useState((initialProduct?.features || []).join("\n"))
  const [images, setImages] = useState<ProductImage[]>(initialProduct?.images || [])
  const [status, setStatus] = useState("")
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const canSubmit = useMemo(() => name && brand && category && Number(price) > 0 && images.length > 0, [name, brand, category, price, images.length])

  function parseSpecs() {
    return specsText.split("\n").reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split(":")
      const value = rest.join(":").trim()
      if (key?.trim() && value) acc[key.trim()] = value
      return acc
    }, {})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      setStatus("Add name, brand, category, price, and at least one image.")
      return
    }

    const input = {
      name,
      brand,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images,
      specs: parseSpecs(),
      features: featuresText.split("\n").map((item) => item.trim()).filter(Boolean),
      availability,
      featured,
      badge: badge || undefined
    }

    try {
      setStatus("Saving...")
      if (mode === "Update" && initialProduct) await updateProduct(initialProduct.id, input)
      else await createProduct(input)
      setStatus(mode === "Update" ? "Product updated." : "Product created.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save product.")
    }
  }

  return (
    <Card className="p-lg">
      <form className="grid gap-md" onSubmit={handleSubmit}>
        <div className="grid gap-md md:grid-cols-2">
          <Input placeholder="Product name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input placeholder="Brand" value={brand} onChange={(event) => setBrand(event.target.value)} />
          <Input placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          <Input placeholder="Price" inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value)} />
          <Input placeholder="Original price" inputMode="numeric" value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} />
          <select className="h-11 rounded-md border bg-background px-md text-sm" value={availability} onChange={(event) => setAvailability(event.target.value as ProductAvailability)}>
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>On Order</option>
          </select>
        </div>
        <div className="grid gap-md md:grid-cols-2">
          <label className="flex items-center gap-sm text-sm font-semibold">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            Featured
          </label>
          <select className="h-11 rounded-md border bg-background px-md text-sm" value={badge} onChange={(event) => setBadge(event.target.value as ProductBadge | "")}>
            <option value="">No badge</option>
            <option>Best Seller</option>
            <option>New Arrival</option>
            <option>On Sale</option>
          </select>
        </div>
        <textarea className="min-h-28 rounded-md border bg-background p-md text-sm outline-none" placeholder="Specifications as key:value lines" value={specsText} onChange={(event) => setSpecsText(event.target.value)} />
        <textarea className="min-h-28 rounded-md border bg-background p-md text-sm outline-none" placeholder="Features, one per line" value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} />
        <div className="rounded-md border border-dashed p-lg text-sm text-muted">
          <div className="mb-md flex flex-wrap gap-sm">
            {images.map((image) => <span key={image.publicId} className="rounded-sm bg-surface px-sm py-xs">{image.alt}</span>)}
          </div>
          {uploadPreset ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              onSuccess={(result) => {
                const info = result.info as { public_id?: string; original_filename?: string } | undefined
                if (!info?.public_id) return
                setImages((current) => [...current, { publicId: info.public_id!, alt: `${name || info.original_filename || "Product"} image` }])
              }}
            >
              {({ open }) => <Button type="button" variant="outline" onClick={() => open()}>Upload Image</Button>}
            </CldUploadWidget>
          ) : (
            <p>Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads.</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <Button type="submit" className="w-fit" disabled={!canSubmit}>{mode} Product</Button>
          {status ? <p className="text-sm text-muted">{status}</p> : null}
        </div>
      </form>
    </Card>
  )
}
