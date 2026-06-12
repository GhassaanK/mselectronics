"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus, Check, X, Star } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { AdminShell } from "@/components/admin/AdminShell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleBrands } from "@/lib/firebase/sample-data"
import {
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandInput,
} from "@/lib/firebase/admin-catalog"
import type { Brand } from "@/types"

function BrandRow({
  brand,
  onSave,
  onDelete,
}: {
  brand: Brand
  onSave: (id: string, input: Partial<BrandInput>) => Promise<void>
  onDelete: (id: string, name: string) => Promise<void>
}) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(brand.name)
  const [slug, setSlug] = useState(brand.slug)
  const [logoUrl, setLogoUrl] = useState(brand.logoUrl ?? "")
  const [logoPublicId, setLogoPublicId] = useState(brand.logoPublicId ?? "")
  const [featured, setFeatured] = useState(brand.featured ?? false)
  const [displayOrder, setDisplayOrder] = useState(
    String(brand.displayOrder ?? 0)
  )
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)

    await onSave(brand.id, {
      name,
      slug,
      logoUrl,
      logoPublicId,
      featured,
      displayOrder: Number(displayOrder),
    })

    setSaving(false)
    setEditing(false)
  }

  function cancel() {
    setName(brand.name)
    setSlug(brand.slug)
    setLogoUrl(brand.logoUrl ?? "")
    setLogoPublicId(brand.logoPublicId ?? "")
    setFeatured(brand.featured ?? false)
    setDisplayOrder(String(brand.displayOrder ?? 0))
    setEditing(false)
  }

  if (editing) {
    return (
      <tr className="border-t bg-surface/50">
        <td className="p-md">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </td>

        <td className="p-md">
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug"
          />
        </td>

        <td className="p-md">
          <div className="space-y-2">
            {logoUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt=""
                  className="h-12 w-12 rounded border object-contain bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl("")
                    setLogoPublicId("")
                  }}
                  className="text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : uploadPreset ? (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => {
                  const info = result.info as
                    | {
                        secure_url?: string
                        public_id?: string
                      }
                    | undefined

                  if (!info?.secure_url) return

                  setLogoUrl(info.secure_url)
                  setLogoPublicId(info.public_id ?? "")
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => open()}
                  >
                    Upload Logo
                  </Button>
                )}
              </CldUploadWidget>
            ) : null}
          </div>
        </td>

        <td className="p-md">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
        </td>

        <td className="p-md">
          <Input
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            inputMode="numeric"
            className="w-20"
          />
        </td>

        <td className="p-md">
          <div className="flex items-center gap-sm">
            <Button
              size="icon"
              onClick={save}
              disabled={saving}
            >
              <Check size={15} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={cancel}
            >
              <X size={15} />
            </Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t hover:bg-surface/40 transition-colors">
      <td className="p-md font-semibold">{brand.name}</td>

      <td className="p-md text-sm text-muted">{brand.slug}</td>

      <td className="p-md">
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-10 w-10 rounded border object-contain bg-white"
          />
        ) : (
          <span className="italic text-muted">—</span>
        )}
      </td>

      <td className="p-md">
        {brand.featured ? (
          <Star
            size={14}
            className="fill-blue-400 text-blue-500"
          />
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </td>

      <td className="p-md text-sm">{brand.displayOrder}</td>

      <td className="p-md">
        <div className="flex items-center gap-sm">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditing(true)}
          >
            <Pencil size={15} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(brand.id, brand.name)}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </td>
    </tr>
  )
}

function AddBrandRow({
  onAdd,
}: {
  onAdd: (input: BrandInput) => Promise<void>
}) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [logoPublicId, setLogoPublicId] = useState("")
  const [featured, setFeatured] = useState(false)
  const [displayOrder, setDisplayOrder] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleNameChange(value: string) {
    setName(value)

    if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
      setSlug(
        value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      )
    }
  }

  async function save() {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.")
      return
    }

    setSaving(true)
    setError("")

    await onAdd({
      name,
      slug,
      logoUrl,
      logoPublicId,
      featured,
      displayOrder: Number(displayOrder) || 0,
    })

    setName("")
    setSlug("")
    setLogoUrl("")
    setLogoPublicId("")
    setFeatured(false)
    setDisplayOrder("")
    setSaving(false)
    setOpen(false)
  }

  if (!open) {
    return (
      <tr>
        <td colSpan={6} className="p-md">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Brand
          </Button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t bg-blue-500/5">
      <td className="p-md">
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Brand name *"
        />
      </td>

      <td className="p-md">
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug *"
        />
      </td>

      <td className="p-md">
        <div className="space-y-2">
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-12 rounded border object-contain bg-white"
              />

              <button
                type="button"
                onClick={() => {
                  setLogoUrl("")
                  setLogoPublicId("")
                }}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            </div>
          ) : uploadPreset ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              onSuccess={(result) => {
                const info = result.info as
                  | {
                      secure_url?: string
                      public_id?: string
                    }
                  | undefined

                if (!info?.secure_url) return

                setLogoUrl(info.secure_url)
                setLogoPublicId(info.public_id ?? "")
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => open()}
                >
                  Upload Logo
                </Button>
              )}
            </CldUploadWidget>
          ) : null}
        </div>
      </td>

      <td className="p-md">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4"
        />
      </td>

      <td className="p-md">
        <Input
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          inputMode="numeric"
          placeholder="0"
          className="w-20"
        />
      </td>

      <td className="p-md">
        <div className="grid gap-xs">
          <div className="flex items-center gap-sm">
            <Button
              size="icon"
              onClick={save}
              disabled={saving}
            >
              <Check size={15} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <X size={15} />
            </Button>
          </div>

          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      </td>
    </tr>
  )
}

async function fetchBrandsClient(): Promise<Brand[]> {
  if (!firebaseEnabled || !db) return sampleBrands

  const snap = await getDocs(
    query(collection(db, "brands"), orderBy("displayOrder"))
  )

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Brand, "id">),
  }))
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchBrandsClient().then((data) => {
      setBrands(data)
      setLoading(false)
    })
  }, [])

  async function handleAdd(input: BrandInput) {
    try {
      setStatus("Saving...")

      const ref = await createBrand(input)

      setBrands((prev) =>
        [...(prev ?? []), { id: ref.id, ...input }].sort(
          (a, b) => a.displayOrder - b.displayOrder
        )
      )

      setStatus("Brand added.")
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "Error adding brand."
      )
    }
  }

  async function handleSave(
    id: string,
    input: Partial<BrandInput>
  ) {
    try {
      setStatus("Saving...")

      await updateBrand(id, input)

      setBrands((prev) =>
        (prev ?? []).map((b) =>
          b.id === id ? { ...b, ...input } : b
        )
      )

      setStatus("Saved.")
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "Error saving brand."
      )
    }
  }

  async function handleDelete(
    id: string,
    name: string
  ) {
    if (
      !confirm(
        `Delete brand "${name}"? This won't delete its products.`
      )
    ) {
      return
    }

    try {
      setStatus("Deleting...")

      await deleteBrand(id)

      setBrands((prev) =>
        (prev ?? []).filter((b) => b.id !== id)
      )

      setStatus("Brand deleted.")
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "Error deleting brand."
      )
    }
  }

  return (
    <AdminShell>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="heading-tight text-3xl">
            Brands
          </h1>
          <p className="mt-xs text-sm text-muted">
            Add, edit, or remove brands.
          </p>
        </div>

        {status && (
          <p className="text-sm text-muted">
            {status}
          </p>
        )}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-lg text-sm text-muted">
            Loading brands...
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="p-md">Name</th>
                <th className="p-md">Slug</th>
                <th className="p-md">Logo</th>
                <th className="p-md">Featured</th>
                <th className="p-md">Order</th>
                <th className="p-md">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(brands ?? []).map((brand) => (
                <BrandRow
                  key={brand.id}
                  brand={brand}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}

              <AddBrandRow onAdd={handleAdd} />
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  )
}