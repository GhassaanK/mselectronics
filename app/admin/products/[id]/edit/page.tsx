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
  return <AdminShell><h1 className="heading-tight mb-lg text-3xl">Edit Product</h1><ProductForm mode="Update" initialProduct={serializeProduct(product)} /></AdminShell>
}
