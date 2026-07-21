"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ImageOff, Pencil, Search } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/DeleteProductButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getProductThumbnail } from "@/lib/cloudinary/utils"
import { formatPrice } from "@/lib/utils/format"
import type { SerializableProduct } from "@/types"

type Props = {
  products: SerializableProduct[]
}

function statusClass(status: string) {
  if (status === "In Stock") return "bg-green-50 text-green-700 ring-green-200"
  if (status === "On Order") return "bg-amber-50 text-amber-700 ring-amber-200"
  return "bg-red-50 text-red-700 ring-red-200"
}

export function AdminProductsClient({ products }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products

    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.availability,
        product.badge ?? "",
        formatPrice(product.price),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    )
  }, [products, query])

  return (
    <Card className="overflow-hidden rounded-lg">
      <div className="flex flex-col gap-3 border-b border-[#E5E5E5] bg-white px-4 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111111]">Product inventory</h2>
          <p className="mt-1 text-xs text-[#737373]">
            Use thumbnails and search to quickly spot wrong, missing, or outdated product entries.
          </p>
        </div>

        <label className="relative block w-full xl:w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" size={16} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, status..."
            className="h-10 pl-9"
          />
        </label>
      </div>

      <div className="border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-xs font-medium text-[#737373]">
        Showing {filtered.length} of {products.length} products
      </div>

      <div className="grid max-h-[55vh] gap-3 overflow-auto p-3 lg:hidden">
        {filtered.map((product) => {
          const primaryImage = product.images?.[0]
          const imageCount = product.images?.length ?? 0

          return (
            <div key={product.id} className="rounded-lg border border-[#E5E5E5] bg-white p-3">
              <div className="flex gap-3">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F8F8F8]">
                  {primaryImage?.publicId ? (
                    <Image
                      src={getProductThumbnail(primaryImage.publicId)}
                      alt={primaryImage.alt || product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <ImageOff size={18} className="text-[#AAAAAA]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#111111]">
                    {product.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#737373]">
                    {product.brand} / {product.category}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#111111]">{formatPrice(product.price)}</span>
                    <span className={["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", statusClass(product.availability)].join(" ")}>
                      {product.availability}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#737373]">
                    {imageCount > 0 ? `${imageCount} image${imageCount === 1 ? "" : "s"}` : "No image uploaded"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <Button asChild variant="outline" size="sm" aria-label={`Edit ${product.name}`}>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Pencil size={14} />
                    Edit
                  </Link>
                </Button>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </div>
          )
        })}

        {filtered.length === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-lg bg-white text-sm text-[#737373]">
            No products match your search.
          </div>
        ) : null}
      </div>

      <div className="hidden max-h-[calc(100vh-350px)] overflow-auto lg:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-[#E5E5E5] bg-[#F8F8F8] text-xs uppercase tracking-[0.08em] text-[#737373]">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Brand</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filtered.map((product) => {
              const primaryImage = product.images?.[0]
              const imageCount = product.images?.length ?? 0

              return (
                <tr key={product.id} className="bg-white transition-colors hover:bg-[#FAFAFA]">
                  <td className="px-4 py-4">
                    <div className="max-w-[320px]">
                      <p className="font-semibold leading-snug text-[#111111]">{product.name}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {product.featured ? (
                          <span className="rounded bg-[#111111] px-2 py-0.5 text-[11px] font-semibold text-white">
                            Featured
                          </span>
                        ) : null}
                        {product.badge ? (
                          <span className="rounded bg-[#F2F2F2] px-2 py-0.5 text-[11px] font-semibold text-[#525252]">
                            {product.badge}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F8F8F8]">
                        {primaryImage?.publicId ? (
                          <Image
                            src={getProductThumbnail(primaryImage.publicId)}
                            alt={primaryImage.alt || product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <ImageOff size={18} className="text-[#AAAAAA]" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#111111]">
                          {imageCount > 0 ? `${imageCount} image${imageCount === 1 ? "" : "s"}` : "No image"}
                        </p>
                        <p className="mt-0.5 text-xs text-[#737373]">
                          {primaryImage?.publicId ? "Primary image set" : "Upload needed"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#525252]">{product.brand}</td>
                  <td className="px-4 py-4 text-[#525252]">{product.category}</td>
                  <td className="px-4 py-4 font-semibold text-[#111111]">{formatPrice(product.price)}</td>
                  <td className="px-4 py-4">
                    <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusClass(product.availability)].join(" ")}>
                      {product.availability}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm" aria-label={`Edit ${product.name}`}>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil size={14} />
                          Edit
                        </Link>
                      </Button>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <div className="flex h-44 items-center justify-center bg-white text-sm text-[#737373]">
            No products match your search.
          </div>
        ) : null}
      </div>
    </Card>
  )
}
