import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ProductActions } from "@/components/shop/ProductActions"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { CloudinaryImage } from "@/components/shared/CloudinaryImage"
import { getSiteSettings } from "@/lib/firebase/catalog"
import { getProductById, getProductsByCategory } from "@/lib/firebase/products"
import { formatPrice } from "@/lib/utils/format"
import { serializeProduct, serializeProducts } from "@/lib/utils/serialize"
import { brandConfig } from "@/config/brand"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return { title: "Product not found" }
  return {
    title: product.name,
    description: `${product.brand} ${product.category} at MS Electronics.`,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: { title: product.name, description: `${formatPrice(product.price)} · ${product.availability}` }
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const [product, settings] = await Promise.all([getProductById(id), getSiteSettings()])
  if (!product) notFound()
  const related = (await getProductsByCategory(product.category)).filter((item) => item.id !== product.id).slice(0, 4)
  const serializedProduct = serializeProduct(product)
  const serializedRelated = serializeProducts(related)
  const image = product.images[0]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    category: product.category,
    offers: { "@type": "Offer", priceCurrency: "PKR", price: product.price, availability: product.availability === "In Stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder" }
  }

  return (
    <section className="container-page py-2xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-surface p-lg">
          <div className="relative aspect-square">
            <CloudinaryImage src={image.publicId} alt={image.alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">{product.brand} · {product.availability}</p>
          <h1 className="heading-tight mt-sm text-4xl">{product.name}</h1>
          <div className="mt-lg flex items-end gap-md">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            {product.originalPrice ? <p className="text-muted line-through">{formatPrice(product.originalPrice)}</p> : null}
          </div>
          <Card className="mt-xl p-lg">
            <ProductActions product={serializedProduct} whatsappNumber={settings.whatsappNumber || brandConfig.whatsappNumber} />
          </Card>
        </aside>
      </div>
      <div className="mt-2xl grid gap-xl lg:grid-cols-2">
        <Card className="p-lg">
          <h2 className="heading-tight mb-md text-2xl">Specifications</h2>
          <dl className="grid gap-sm">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-md border-b py-sm text-sm">
                <dt className="font-semibold">{key}</dt>
                <dd className="text-right text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="p-lg">
          <h2 className="heading-tight mb-md text-2xl">Features</h2>
          <ul className="grid gap-sm text-muted">
            {product.features.map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
        </Card>
      </div>
      {related.length ? (
        <div className="mt-3xl">
          <h2 className="heading-tight mb-lg text-3xl">Related products</h2>
          <ProductGrid products={serializedRelated} />
        </div>
      ) : null}
    </section>
  )
}
