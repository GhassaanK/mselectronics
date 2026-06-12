"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleBrands, sampleCategories } from "@/lib/firebase/sample-data"
import { createProduct, updateProduct } from "@/lib/firebase/admin-products"
import type { Brand, Category, ProductAvailability, ProductBadge, ProductImage, SerializableProduct } from "@/types"

type ProductFormProps = {
  mode?: "Create" | "Update"
  initialProduct?: SerializableProduct | null
}

// Fetch directly from Firestore — bypasses unstable_cache which only works server-side
async function fetchOptions(): Promise<{ brands: Brand[]; categories: Category[] }> {
  if (!firebaseEnabled || !db) return { brands: sampleBrands, categories: sampleCategories }
  const [brandSnap, categorySnap] = await Promise.all([
    getDocs(query(collection(db, "brands"), orderBy("displayOrder"))),
    getDocs(query(collection(db, "categories"), orderBy("name"))),
  ])
  return {
    brands: brandSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Brand, "id">) })),
    categories: categorySnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) })),
  }
}

const SELECT_CLS = "h-11 rounded-md border bg-background px-md text-sm text-foreground disabled:opacity-50"

export function ProductForm({ mode = "Create", initialProduct }: ProductFormProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)

  const [name, setName] = useState(initialProduct?.name || "")
  const [brand, setBrand] = useState(initialProduct?.brand || "")
  const [category, setCategory] = useState(initialProduct?.category || "")
  const [price, setPrice] = useState(String(initialProduct?.price || ""))
  const [originalPrice, setOriginalPrice] = useState(String(initialProduct?.originalPrice || ""))
  const [availability, setAvailability] = useState<ProductAvailability>(initialProduct?.availability || "In Stock")
  const [featured, setFeatured] = useState(Boolean(initialProduct?.featured))
  const [badge, setBadge] = useState<ProductBadge | "">(initialProduct?.badge || "")
  const [specsText, setSpecsText] = useState(
    Object.entries(initialProduct?.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n")
  )
  const [featuresText, setFeaturesText] = useState((initialProduct?.features || []).join("\n"))
  const [images, setImages] = useState<ProductImage[]>(initialProduct?.images || [])
  const [status, setStatus] = useState("")

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  // Load brands + categories on mount
  useEffect(() => {
    fetchOptions().then(({ brands: b, categories: c }) => {
      setBrands(b)
      setCategories(c)
      setOptionsLoading(false)
    })
  }, [])

  const canSubmit = useMemo(
    () => name && brand && category && Number(price) > 0 && images.length > 0,
    [name, brand, category, price, images.length]
  )

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
      setStatus("Fill in name, brand, category, price, and at least one image.")
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
      badge: badge || undefined,
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

        {/* ── Basic info ──────────────────────────────── */}
        <div className="grid gap-md md:grid-cols-2">
          <div className="md:col-span-2">
            <Input placeholder="Product name *" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Brand dropdown — locked to what's in the database */}
          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Brand *</label>
            <select
              className={SELECT_CLS}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={optionsLoading}
              required
            >
              <option value="">{optionsLoading ? "Loading brands..." : "Select a brand"}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            {!optionsLoading && brands.length === 0 && (
              <p className="text-xs text-red-500">No brands found — add brands first in the Brands page.</p>
            )}
          </div>

          {/* Category dropdown — locked to what's in the database */}
          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Category *</label>
            <select
              className={SELECT_CLS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={optionsLoading}
              required
            >
              <option value="">{optionsLoading ? "Loading categories..." : "Select a category"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {!optionsLoading && categories.length === 0 && (
              <p className="text-xs text-red-500">No categories found — add categories first in the Categories page.</p>
            )}
          </div>

          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Price (PKR) *</label>
            <Input placeholder="e.g. 158000" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Original price (PKR) — for strikethrough</label>
            <Input placeholder="e.g. 172000" inputMode="numeric" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
          </div>

          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Availability *</label>
            <select className={SELECT_CLS} value={availability} onChange={(e) => setAvailability(e.target.value as ProductAvailability)}>
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>On Order</option>
            </select>
          </div>

          <div className="grid gap-xs">
            <label className="text-xs font-semibold text-muted">Badge</label>
            <select className={SELECT_CLS} value={badge} onChange={(e) => setBadge(e.target.value as ProductBadge | "")}>
              <option value="">No badge</option>
              <option>Best Seller</option>
              <option>New Arrival</option>
              <option>On Sale</option>
            </select>
          </div>
        </div>

        {/* ── Flags ───────────────────────────────────── */}
        <label className="flex items-center gap-sm text-sm font-semibold">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured — shows on homepage featured section
        </label>

        {/* ── Specs & features ────────────────────────── */}
        <div className="grid gap-xs">
          <label className="text-xs font-semibold text-muted">Specifications — one per line as Key: Value</label>
          <textarea
            className="min-h-28 rounded-md border bg-background p-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder={"Capacity: 1 Ton\nTechnology: DC Inverter\nWarranty: Official"}
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
          />
        </div>

        <div className="grid gap-xs">
          <label className="text-xs font-semibold text-muted">Features — one per line</label>
          <textarea
            className="min-h-28 rounded-md border bg-background p-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder={"Fast cooling\nEnergy efficient\nHeat and cool support"}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </div>

        {/* ── Images ──────────────────────────────────── */}
        <div className="grid gap-xs">
          <label className="text-xs font-semibold text-muted">Product images *</label>
          <div className="rounded-md border border-dashed p-lg text-sm text-muted">
            {images.length > 0 && (
              <div className="mb-md flex flex-wrap gap-sm">
                {images.map((image, i) => (
                  <div key={image.publicId} className="flex items-center gap-xs rounded-sm bg-surface px-sm py-xs">
                    <span>{image.alt}</span>
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="ml-xs text-muted hover:text-red-500"
                      aria-label="Remove image"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            {uploadPreset ? (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => {
                  const info = result.info as { public_id?: string; original_filename?: string } | undefined
                  if (!info?.public_id) return
                  setImages((current) => [
                    ...current,
                    { publicId: info.public_id!, alt: `${name || info.original_filename || "Product"} image` },
                  ])
                }}
              >
                {({ open }) => (
                  <Button type="button" variant="outline" onClick={() => open()}>
                    {images.length === 0 ? "Upload Image" : "Upload Another"}
                  </Button>
                )}
              </CldUploadWidget>
            ) : (
              <p className="text-xs">Set <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to enable uploads.</p>
            )}
          </div>
        </div>

        {/* ── Submit ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-md border-t pt-md">
          <Button type="submit" className="w-fit" disabled={!canSubmit || optionsLoading}>
            {mode} Product
          </Button>
          {status && <p className="text-sm text-muted">{status}</p>}
        </div>

      </form>
    </Card>
  )
}