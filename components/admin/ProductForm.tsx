"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleBrands, sampleCategories } from "@/lib/firebase/sample-data"
import { createProduct, updateProduct } from "@/lib/firebase/admin-products"
import type {
  Brand,
  Category,
  ColorVariant,
  ProductAvailability,
  ProductBadge,
  ProductImage,
  SerializableProduct,
  SizeVariant,
} from "@/types"

type ProductFormProps = {
  mode?: "Create" | "Update"
  initialProduct?: SerializableProduct | null
}

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
const TEXTAREA_CLS = "min-h-28 rounded-md border bg-background p-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
const SECTION_LABEL = "text-xs font-semibold text-muted"

// ── Blank templates ──────────────────────────────────────────
function blankColorVariant(): ColorVariant {
  return { id: crypto.randomUUID(), label: "", hex: "#000000", images: [] }
}

function blankSizeVariant(): SizeVariant {
  return {
    id: crypto.randomUUID(),
    label: "",
    price: 0,
    originalPrice: undefined,
    availability: "In Stock",
    specs: {},
    features: [],
  }
}

// ── Helpers for size variant text fields ─────────────────────
function specsToText(specs: Record<string, string>) {
  return Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join("\n")
}

function textToSpecs(text: string): Record<string, string> {
  return text.split("\n").reduce<Record<string, string>>((acc, line) => {
    const [key, ...rest] = line.split(":")
    const value = rest.join(":").trim()
    if (key?.trim() && value) acc[key.trim()] = value
    return acc
  }, {})
}

export function ProductForm({ mode = "Create", initialProduct }: ProductFormProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)

  // ── Base product fields ──────────────────────────────────
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

  // ── Variant fields ───────────────────────────────────────
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    initialProduct?.colorVariants ?? []
  )
  // Per-size-variant: store specs/features as editable text strings
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>(
    initialProduct?.sizeVariants ?? []
  )
  const [sizeSpecsText, setSizeSpecsText] = useState<Record<string, string>>(
    Object.fromEntries((initialProduct?.sizeVariants ?? []).map((v) => [v.id, specsToText(v.specs)]))
  )
  const [sizeFeaturesText, setSizeFeaturesText] = useState<Record<string, string>>(
    Object.fromEntries((initialProduct?.sizeVariants ?? []).map((v) => [v.id, v.features.join("\n")]))
  )

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

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

  // ── Color variant helpers ────────────────────────────────
  function addColorVariant() {
    setColorVariants((prev) => [...prev, blankColorVariant()])
  }

  function removeColorVariant(id: string) {
    setColorVariants((prev) => prev.filter((v) => v.id !== id))
  }

  function updateColorVariant(id: string, patch: Partial<ColorVariant>) {
    setColorVariants((prev) => prev.map((v) => v.id === id ? { ...v, ...patch } : v))
  }

  function addColorImage(id: string, image: ProductImage) {
    setColorVariants((prev) =>
      prev.map((v) => v.id === id ? { ...v, images: [...v.images, image] } : v)
    )
  }

  function removeColorImage(variantId: string, imageIndex: number) {
    setColorVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, images: v.images.filter((_, i) => i !== imageIndex) }
          : v
      )
    )
  }

  // ── Size variant helpers ─────────────────────────────────
  function addSizeVariant() {
    const blank = blankSizeVariant()
    setSizeVariants((prev) => [...prev, blank])
    setSizeSpecsText((prev) => ({ ...prev, [blank.id]: "" }))
    setSizeFeaturesText((prev) => ({ ...prev, [blank.id]: "" }))
  }

  function removeSizeVariant(id: string) {
    setSizeVariants((prev) => prev.filter((v) => v.id !== id))
    setSizeSpecsText((prev) => { const next = { ...prev }; delete next[id]; return next })
    setSizeFeaturesText((prev) => { const next = { ...prev }; delete next[id]; return next })
  }

  function updateSizeVariant(id: string, patch: Partial<Omit<SizeVariant, "specs" | "features">>) {
    setSizeVariants((prev) => prev.map((v) => v.id === id ? { ...v, ...patch } : v))
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      setStatus("Fill in name, brand, category, price, and at least one image.")
      return
    }

    // Resolve size variants with their parsed specs/features
    const resolvedSizeVariants: SizeVariant[] = sizeVariants.map((v) => ({
      ...v,
      specs: textToSpecs(sizeSpecsText[v.id] ?? ""),
      features: (sizeFeaturesText[v.id] ?? "").split("\n").map((f) => f.trim()).filter(Boolean),
    }))

    const input = {
      name,
      brand,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images,
      specs: Object.entries(specsText.split("\n").reduce<Record<string, string>>((acc, line) => {
        const [key, ...rest] = line.split(":")
        const value = rest.join(":").trim()
        if (key?.trim() && value) acc[key.trim()] = value
        return acc
      }, {})).reduce<Record<string, string>>((acc, [k, v]) => { acc[k] = v; return acc }, {}),
      features: featuresText.split("\n").map((item) => item.trim()).filter(Boolean),
      availability,
      featured,
      badge: badge || undefined,
      colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
      sizeVariants: resolvedSizeVariants.length > 0 ? resolvedSizeVariants : undefined,
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

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Brand *</label>
            <select className={SELECT_CLS} value={brand} onChange={(e) => setBrand(e.target.value)} disabled={optionsLoading} required>
              <option value="">{optionsLoading ? "Loading brands..." : "Select a brand"}</option>
              {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            {!optionsLoading && brands.length === 0 && (
              <p className="text-xs text-red-500">No brands found — add brands first in the Brands page.</p>
            )}
          </div>

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Category *</label>
            <select className={SELECT_CLS} value={category} onChange={(e) => setCategory(e.target.value)} disabled={optionsLoading} required>
              <option value="">{optionsLoading ? "Loading categories..." : "Select a category"}</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            {!optionsLoading && categories.length === 0 && (
              <p className="text-xs text-red-500">No categories found — add categories first in the Categories page.</p>
            )}
          </div>

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Price (PKR) *</label>
            <Input placeholder="e.g. 158000" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Original price (PKR) — for strikethrough</label>
            <Input placeholder="e.g. 172000" inputMode="numeric" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
          </div>

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Availability *</label>
            <select className={SELECT_CLS} value={availability} onChange={(e) => setAvailability(e.target.value as ProductAvailability)}>
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>On Order</option>
            </select>
          </div>

          <div className="grid gap-xs">
            <label className={SECTION_LABEL}>Badge</label>
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
          <label className={SECTION_LABEL}>Base specifications — one per line as Key: Value</label>
          <textarea className={TEXTAREA_CLS} placeholder={"Capacity: 1 Ton\nTechnology: DC Inverter\nWarranty: Official"} value={specsText} onChange={(e) => setSpecsText(e.target.value)} />
        </div>

        <div className="grid gap-xs">
          <label className={SECTION_LABEL}>Base features — one per line</label>
          <textarea className={TEXTAREA_CLS} placeholder={"Fast cooling\nEnergy efficient\nHeat and cool support"} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </div>

        {/* ── Base images ─────────────────────────────── */}
        <div className="grid gap-xs">
          <label className={SECTION_LABEL}>Product images *</label>
          <div className="rounded-md border border-dashed p-lg text-sm text-muted">
            {images.length > 0 && (
              <div className="mb-md flex flex-wrap gap-sm">
                {images.map((image, i) => (
                  <div key={image.publicId} className="flex items-center gap-xs rounded-sm bg-surface px-sm py-xs">
                    <span>{image.alt}</span>
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="ml-xs text-muted hover:text-red-500" aria-label="Remove image">×</button>
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
                  setImages((current) => [...current, { publicId: info.public_id!, alt: `${name || info.original_filename || "Product"} image` }])
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

        {/* ══════════════════════════════════════════════
            COLOR VARIANTS
        ══════════════════════════════════════════════ */}
        <div className="grid gap-sm border-t pt-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Color Variants</p>
              <p className="text-xs text-muted">Each color gets its own images and swatch. Optional.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addColorVariant} className="gap-1.5">
              <Plus size={14} /> Add Color
            </Button>
          </div>

          {colorVariants.map((variant, index) => (
            <div key={variant.id} className="rounded-lg border bg-surface p-md grid gap-sm">
              <div className="flex items-center justify-between">
                <p className={SECTION_LABEL}>Color {index + 1}</p>
                <button type="button" onClick={() => removeColorVariant(variant.id)} className="text-muted hover:text-red-500 transition-colors" aria-label="Remove color variant">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid gap-sm sm:grid-cols-3">
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Label (e.g. White)</label>
                  <Input
                    placeholder="White"
                    value={variant.label}
                    onChange={(e) => updateColorVariant(variant.id, { label: e.target.value })}
                  />
                </div>
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Swatch color</label>
                  <div className="flex items-center gap-sm">
                    <input
                      type="color"
                      value={variant.hex}
                      onChange={(e) => updateColorVariant(variant.id, { hex: e.target.value })}
                      className="h-11 w-14 cursor-pointer rounded-md border bg-background p-1"
                    />
                    <Input
                      placeholder="#FFFFFF"
                      value={variant.hex}
                      onChange={(e) => updateColorVariant(variant.id, { hex: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Color variant images */}
              <div className="grid gap-xs">
                <label className={SECTION_LABEL}>Images for this color</label>
                <div className="rounded-md border border-dashed p-sm text-sm text-muted">
                  {variant.images.length > 0 && (
                    <div className="mb-sm flex flex-wrap gap-xs">
                      {variant.images.map((img, i) => (
                        <div key={img.publicId} className="flex items-center gap-xs rounded-sm bg-white px-sm py-xs text-xs border">
                          <span className="max-w-[140px] truncate">{img.alt || img.publicId}</span>
                          <button type="button" onClick={() => removeColorImage(variant.id, i)} className="text-muted hover:text-red-500" aria-label="Remove image">×</button>
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
                        addColorImage(variant.id, {
                          publicId: info.public_id!,
                          alt: `${name || "Product"} ${variant.label || "color"} image`,
                        })
                      }}
                    >
                      {({ open }) => (
                        <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                          {variant.images.length === 0 ? "Upload Image" : "Upload Another"}
                        </Button>
                      )}
                    </CldUploadWidget>
                  ) : (
                    <p className="text-xs">Set <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to enable uploads.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            SIZE / CAPACITY VARIANTS
        ══════════════════════════════════════════════ */}
        <div className="grid gap-sm border-t pt-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Size / Capacity Variants</p>
              <p className="text-xs text-muted">Each size gets its own price, specs, and features. Optional.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSizeVariant} className="gap-1.5">
              <Plus size={14} /> Add Size
            </Button>
          </div>

          {sizeVariants.map((variant, index) => (
            <div key={variant.id} className="rounded-lg border bg-surface p-md grid gap-sm">
              <div className="flex items-center justify-between">
                <p className={SECTION_LABEL}>Size {index + 1}</p>
                <button type="button" onClick={() => removeSizeVariant(variant.id)} className="text-muted hover:text-red-500 transition-colors" aria-label="Remove size variant">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Label (e.g. 1.5 Ton)</label>
                  <Input
                    placeholder="1.5 Ton"
                    value={variant.label}
                    onChange={(e) => updateSizeVariant(variant.id, { label: e.target.value })}
                  />
                </div>
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Price (PKR)</label>
                  <Input
                    placeholder="e.g. 115000"
                    inputMode="numeric"
                    value={variant.price || ""}
                    onChange={(e) => updateSizeVariant(variant.id, { price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Original price — strikethrough</label>
                  <Input
                    placeholder="e.g. 125000"
                    inputMode="numeric"
                    value={variant.originalPrice ?? ""}
                    onChange={(e) => updateSizeVariant(variant.id, { originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Availability</label>
                  <select
                    className={SELECT_CLS}
                    value={variant.availability}
                    onChange={(e) => updateSizeVariant(variant.id, { availability: e.target.value as ProductAvailability })}
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>On Order</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-sm sm:grid-cols-2">
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Specs — one per line as Key: Value</label>
                  <textarea
                    className={TEXTAREA_CLS}
                    placeholder={"Cooling Capacity: 1.5 Ton\nEER: 3.0"}
                    value={sizeSpecsText[variant.id] ?? ""}
                    onChange={(e) => setSizeSpecsText((prev) => ({ ...prev, [variant.id]: e.target.value }))}
                  />
                </div>
                <div className="grid gap-xs">
                  <label className={SECTION_LABEL}>Features — one per line</label>
                  <textarea
                    className={TEXTAREA_CLS}
                    placeholder={"Inverter Technology\nAuto Restart\nTurbo Cool"}
                    value={sizeFeaturesText[variant.id] ?? ""}
                    onChange={(e) => setSizeFeaturesText((prev) => ({ ...prev, [variant.id]: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          ))}
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