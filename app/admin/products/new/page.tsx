import { AdminShell } from "@/components/admin/AdminShell"
import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
          Catalog
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
          New product
        </h1>
        <p className="mt-2 text-sm text-[#737373]">
          Add product details, images, pricing, variants, and catalog status.
        </p>
      </div>
      <ProductForm />
    </AdminShell>
  )
}
