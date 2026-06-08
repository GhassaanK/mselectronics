import { AdminShell } from "@/components/admin/AdminShell"
import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return <AdminShell><h1 className="heading-tight mb-lg text-3xl">New Product</h1><ProductForm /></AdminShell>
}
