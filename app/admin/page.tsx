import { Card } from "@/components/ui/card"
import { AdminShell } from "@/components/admin/AdminShell"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"

export default async function AdminPage() {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()])
  const stats = [
    ["Total Products", products.length],
    ["Total Categories", categories.length],
    ["Total Brands", brands.length],
    ["Recent Inquiries", 0]
  ]

  return (
    <AdminShell>
      <h1 className="heading-tight mb-lg text-3xl">Dashboard</h1>
      <div className="grid gap-md md:grid-cols-4">
        {stats.map(([label, value]) => <Card key={String(label)} className="p-md"><p className="text-sm text-muted">{String(label)}</p><p className="mt-sm text-2xl font-bold">{value}</p></Card>)}
      </div>
      <Card className="mt-lg p-lg">
        <h2 className="mb-md font-bold">Recent Products</h2>
        <div className="grid gap-sm text-sm">
          {products.slice(0, 5).map((product) => <div key={product.id} className="flex justify-between border-b py-sm"><span>{product.name}</span><span className="text-muted">{product.availability}</span></div>)}
        </div>
      </Card>
    </AdminShell>
  )
}
