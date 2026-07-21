import Link from "next/link"
import { PackagePlus } from "lucide-react"
import { AdminProductsClient } from "@/components/admin/AdminProductsClient"
import { AdminShell } from "@/components/admin/AdminShell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"

export const revalidate = 0

export default async function AdminProductsPage() {
  const products = await getProducts()
  const serializedProducts = serializeProducts(products)
  const withImages = products.filter((product) => product.images?.length > 0).length
  const missingImages = products.length - withImages

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
            Catalog
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
            Products
          </h1>
          <p className="mt-2 text-sm text-[#737373]">
            Manage catalog items, images, pricing, stock status, and product visibility.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PackagePlus size={16} />
            New Product
          </Link>
        </Button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">Total</p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">{products.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">With Images</p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">{withImages}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">Missing Images</p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">{missingImages}</p>
        </Card>
      </div>

      <AdminProductsClient products={serializedProducts} />
    </AdminShell>
  )
}
