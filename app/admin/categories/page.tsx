import { AdminShell } from "@/components/admin/AdminShell"
import { Card } from "@/components/ui/card"
import { getCategories } from "@/lib/firebase/catalog"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  return <AdminShell><h1 className="heading-tight mb-lg text-3xl">Categories</h1><Card className="p-lg">{categories.map((item) => <div key={item.id} className="flex justify-between border-b py-sm"><span>{item.name}</span><span className="text-muted">{item.productCount}</span></div>)}</Card></AdminShell>
}
