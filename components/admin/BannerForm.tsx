"use client"

import { useState } from "react"
import { Trash2, Plus, GripVertical, Eye, EyeOff } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createBanner, deleteBanner, updateBanner, type Banner } from "@/lib/firebase/banners"

type Props = {
  initialBanners: Banner[]
}

const EMPTY_FORM = {
  imageUrl: "",
  imagePublicId: "",
  headline: "",
  subheadline: "",
  ctaLabel: "Shop Now",
  ctaHref: "/shop",
  order: 0,
  active: true,
}

export function BannerForm({ initialBanners }: Props) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState("")
  const [adding, setAdding] = useState(false)

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  function updateForm(key: keyof typeof EMPTY_FORM, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleAdd() {
    if (!form.headline && !form.imageUrl) {
      setStatus("Add at least an image or headline.")
      return
    }
    try {
      setStatus("Saving...")
      const ref = await createBanner({ ...form, order: banners.length })
      setBanners((prev) => [...prev, { id: ref.id, ...form, order: banners.length }])
      setForm(EMPTY_FORM)
      setAdding(false)
      setStatus("Banner added.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error saving banner.")
    }
  }

  async function handleToggle(banner: Banner) {
    try {
      await updateBanner(banner.id, { active: !banner.active })
      setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, active: !b.active } : b))
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error updating banner.")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this banner?")) return
    try {
      await deleteBanner(id)
      setBanners((prev) => prev.filter((b) => b.id !== id))
      setStatus("Banner deleted.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error deleting banner.")
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Existing banners list ──────────────────────── */}
      {banners.length === 0 && (
        <p className="text-sm text-muted py-4">No banners yet. Add one below.</p>
      )}

      {banners.map((banner, i) => (
        <Card key={banner.id} className="flex items-center gap-3 p-3">
          <GripVertical size={16} className="text-muted shrink-0" />

          {/* Thumbnail or placeholder */}
          <div className="h-14 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
            {banner.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={banner.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted">No image</div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{banner.headline || "(no headline)"}</p>
            <p className="truncate text-xs text-muted">{banner.subheadline || ""}</p>
          </div>

          <span className="text-xs text-muted shrink-0">#{i + 1}</span>

          <button
            onClick={() => handleToggle(banner)}
            aria-label={banner.active ? "Deactivate" : "Activate"}
            className="shrink-0 text-muted hover:text-foreground transition-colors"
          >
            {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            onClick={() => handleDelete(banner.id)}
            aria-label="Delete banner"
            className="shrink-0 text-muted hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </Card>
      ))}

      {/* ── Add new banner ─────────────────────────────── */}
      {adding ? (
        <Card className="p-4 space-y-3">
          <p className="text-sm font-semibold">New Banner</p>

          {/* Image upload */}
          <div className="rounded-md border border-dashed p-3 text-sm text-muted">
            {form.imageUrl ? (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt="" className="h-12 w-20 rounded object-cover" />
                <button onClick={() => updateForm("imageUrl", "")} className="text-xs text-red-500">Remove</button>
              </div>
            ) : uploadPreset ? (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => {
                  const info = result.info as { public_id?: string; secure_url?: string } | undefined
                  if (!info?.secure_url) return
                  updateForm("imageUrl", info.secure_url)
                  updateForm("imagePublicId", info.public_id ?? "")
                }}
              >
                {({ open }) => (
                  <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                    Upload Banner Image
                  </Button>
                )}
              </CldUploadWidget>
            ) : (
              <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => updateForm("imageUrl", e.target.value)} />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Headline" value={form.headline} onChange={(e) => updateForm("headline", e.target.value)} />
            <Input placeholder="Subheadline" value={form.subheadline} onChange={(e) => updateForm("subheadline", e.target.value)} />
            <Input placeholder="CTA label (e.g. Shop Now)" value={form.ctaLabel} onChange={(e) => updateForm("ctaLabel", e.target.value)} />
            <Input placeholder="CTA link (e.g. /shop)" value={form.ctaHref} onChange={(e) => updateForm("ctaHref", e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" size="sm" onClick={handleAdd}>Save Banner</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => { setAdding(false); setForm(EMPTY_FORM) }}>Cancel</Button>
            {status && <p className="text-xs text-muted">{status}</p>}
          </div>
        </Card>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAdding(true)}
          className="gap-1.5"
        >
          <Plus size={14} />
          Add Banner
        </Button>
      )}

      {status && !adding && <p className="text-xs text-muted">{status}</p>}
    </div>
  )
}
