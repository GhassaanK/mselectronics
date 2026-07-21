import { AdminShell } from "@/components/admin/AdminShell"
import { ProductForm } from "@/components/admin/ProductForm"
import { getProductById } from "@/lib/firebase/products"
import { serializeProduct } from "@/lib/utils/serialize"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
          Catalog
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
          Edit product
        </h1>
        <p className="mt-2 text-sm text-[#737373]">
          Update product details, image assets, pricing, variants, and stock status.
        </p>
      </div>
      <ProductForm mode="Update" initialProduct={serializeProduct(product)} />
    </AdminShell>
  )
}
