"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Pencil, Trash2, Plus, Check, X } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { collection, getDocs, query } from "firebase/firestore/lite"

import { AdminShell } from "@/components/admin/AdminShell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleCategories } from "@/lib/firebase/sample-data"
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryInput,
} from "@/lib/firebase/admin-catalog"

import type { Category } from "@/types"

function CategoryRow({
  category,
  productCount,
  onSave,
  onDelete,
}: {
  category: Category
  productCount: number
  onSave: (
    id: string,
    input: Partial<CategoryInput>
  ) => Promise<void>
  onDelete: (
    id: string,
    name: string
  ) => Promise<void>
}) {
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)

  const [imageUrl, setImageUrl] = useState(
    category.imageUrl ?? ""
  )

  const [imagePublicId, setImagePublicId] = useState(
    category.imagePublicId ?? ""
  )
  const [error, setError] = useState("")

  async function save() {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.")
      return
    }

    setSaving(true)
    setError("")

    try {
      await onSave(category.id, {
        name: name.trim(),
        slug: slug.trim(),
        imageUrl,
        imagePublicId,
      })

      setEditing(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save category.")
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setName(category.name)
    setSlug(category.slug)
    setImageUrl(category.imageUrl ?? "")
    setImagePublicId(category.imagePublicId ?? "")
    setEditing(false)
  }

  if (editing) {
    return (
      <tr className="border-t bg-surface/50">
        <td className="p-md">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </td>

        <td className="p-md">
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </td>

        <td className="p-md">
          <div className="space-y-2">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt=""
                width={80}
                height={56}
                className="h-14 w-20 rounded object-cover"
              />
            )}

            {uploadPreset && (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => {
                  const info = result.info as {
                    secure_url?: string
                    public_id?: string
                  }

                  if (!info?.secure_url) return

                  setImageUrl(info.secure_url)
                  setImagePublicId(info.public_id ?? "")
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => open()}
                  >
                    Upload Image
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>
        </td>

        <td className="p-md text-sm">
          {productCount}
        </td>

        <td className="p-md">
          <div className="flex gap-sm">
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
          {error ? (
            <p className="mt-xs text-xs text-red-500">{error}</p>
          ) : null}
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t hover:bg-surface/40">
      <td className="p-md font-semibold">
        {category.name}
      </td>

      <td className="p-md text-sm text-muted">
        {category.slug}
      </td>

      <td className="p-md">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt=""
            width={80}
            height={56}
            className="h-14 w-20 rounded object-cover"
          />
        ) : (
          <span className="italic text-muted">
            No image
          </span>
        )}
      </td>

      <td className="p-md text-sm">
        {productCount}
      </td>

      <td className="p-md">
        <div className="flex gap-sm">
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
            onClick={() =>
              onDelete(category.id, category.name)
            }
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </td>
    </tr>
  )
}

function AddCategoryRow({
  onAdd,
}: {
  onAdd: (input: CategoryInput) => Promise<void>
}) {
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const [imageUrl, setImageUrl] = useState("")
  const [imagePublicId, setImagePublicId] =
    useState("")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleNameChange(value: string) {
    setName(value)

    if (!slug) {
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

    try {
      await onAdd({
        name: name.trim(),
        slug: slug.trim(),
        imageUrl,
        imagePublicId,
        productCount: 0,
      })

      setName("")
      setSlug("")
      setImageUrl("")
      setImagePublicId("")
      setOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to add category.")
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <tr>
        <td colSpan={5} className="p-md">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Plus size={14} />
            Add Category
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
          onChange={(e) =>
            handleNameChange(e.target.value)
          }
          placeholder="Category Name"
        />
      </td>

      <td className="p-md">
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </td>

      <td className="p-md">
        <div className="space-y-2">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              width={80}
              height={56}
              className="h-14 w-20 rounded object-cover"
            />
          )}

          {uploadPreset && (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              onSuccess={(result) => {
                const info = result.info as {
                  secure_url?: string
                  public_id?: string
                }

                if (!info?.secure_url) return

                setImageUrl(info.secure_url)
                setImagePublicId(info.public_id ?? "")
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => open()}
                >
                  Upload Image
                </Button>
              )}
            </CldUploadWidget>
          )}
        </div>
      </td>

      <td className="p-md text-sm">Auto</td>

      <td className="p-md">
        <div className="flex gap-sm">
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
        {error ? (
          <p className="mt-xs text-xs text-red-500">{error}</p>
        ) : null}
      </td>
    </tr>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    async function load() {
      if (!firebaseEnabled || !db) {
        setCategories(sampleCategories)
        setLoading(false)
        return
      }

      try {
        const categoriesSnap = await getDocs(
          query(collection(db, "categories"))
        )

        setCategories(
          categoriesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Category, "id">),
          }))
        )
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to load categories.")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  async function handleAdd(input: CategoryInput) {
    try {
      setStatus("Saving...")
      const ref = await createCategory(input)

      setCategories((prev) => [
        ...prev,
        {
          id: ref.id,
          ...input,
          productCount: input.productCount ?? 0,
        },
      ])
      setStatus("Category added.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to add category."
      setStatus(message)
      throw new Error(message)
    }
  }

  async function handleSave(
    id: string,
    input: Partial<CategoryInput>
  ) {
    try {
      setStatus("Saving...")
      await updateCategory(id, input)

      setCategories((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...input }
            : item
        )
      )
      setStatus("Category saved.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save category."
      setStatus(message)
      throw new Error(message)
    }
  }

  async function handleDelete(
    id: string,
    name: string
  ) {
    if (
      !confirm(`Delete category "${name}"?`)
    )
      return

    try {
      setStatus("Deleting...")
      await deleteCategory(id)

      setCategories((prev) =>
        prev.filter((item) => item.id !== id)
      )
      setStatus("Category deleted.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete category.")
    }
  }

  return (
    <AdminShell>
      <div className="mb-lg">
        <h1 className="heading-tight text-3xl">
          Categories
        </h1>
        {status ? (
          <p className="mt-xs text-sm text-muted">{status}</p>
        ) : null}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-lg">
            Loading categories...
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="p-md">Name</th>
                <th className="p-md">Slug</th>
                <th className="p-md">Image</th>
                <th className="p-md">Products</th>
                <th className="p-md">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  productCount={category.productCount ?? 0}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}

              <AddCategoryRow onAdd={handleAdd} />
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  )
}
