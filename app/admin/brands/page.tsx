import { AdminShell } from "@/components/admin/AdminShell"
import { Card } from "@/components/ui/card"
import { getBrands } from "@/lib/firebase/catalog"

export default async function AdminBrandsPage() {
  const brands = await getBrands()
  return <AdminShell><h1 className="heading-tight mb-lg text-3xl">Brands</h1><Card className="p-lg">{brands.map((item) => <div key={item.id} className="flex justify-between border-b py-sm"><span>{item.name}</span><span className="text-muted">Order {item.displayOrder}</span></div>)}</Card></AdminShell>
}
