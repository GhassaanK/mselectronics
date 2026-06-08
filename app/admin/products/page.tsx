import Link from "next/link"
import { Pencil } from "lucide-react"
import { AdminShell } from "@/components/admin/AdminShell"
import { DeleteProductButton } from "@/components/admin/DeleteProductButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getProducts } from "@/lib/firebase/products"
import { formatPrice } from "@/lib/utils/format"

export default async function AdminProductsPage() {
  const products = await getProducts()
  return (
    <AdminShell>
      <div className="mb-lg flex items-center justify-between">
        <h1 className="heading-tight text-3xl">Products</h1>
        <Button asChild><Link href="/admin/products/new">New Product</Link></Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface"><tr><th className="p-md">Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-md font-semibold">{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.availability}</td>
              <td>
                <div className="flex items-center gap-sm">
                  <Button asChild variant="ghost" size="icon" aria-label={`Edit ${product.name}`}>
                    <Link href={`/admin/products/${product.id}/edit`}><Pencil size={16} /></Link>
                  </Button>
                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </AdminShell>
  )
}
