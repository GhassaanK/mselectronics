import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { ProductActions } from "@/components/shop/ProductActions"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { CloudinaryImage } from "@/components/shared/CloudinaryImage"
import { Reveal } from "@/components/shared/Motion"
import { getSiteSettings } from "@/lib/firebase/catalog"
import { getProductById, getProductsByCategory } from "@/lib/firebase/products"
import { formatPrice } from "@/lib/utils/format"
import { serializeProduct, serializeProducts } from "@/lib/utils/serialize"
import { brandConfig } from "@/config/brand"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    return {
      title: "Product not found",
    }
  }

  return {
    title: product.name,
    description: `${product.brand} ${product.category} at MS Electronics.`,
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: `${formatPrice(product.price)} · ${product.availability}`,
    },
  }
}

const trustItems = [
  {
    icon: BadgeCheck,
    label: "Authorised dealer",
  },
  {
    icon: ShieldCheck,
    label: "Official warranty",
  },
  {
    icon: Truck,
    label: "Same-week delivery",
  },
  {
    icon: CreditCard,
    label: "Installment options",
  },
]

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const [product, settings] = await Promise.all([
    getProductById(id),
    getSiteSettings(),
  ])

  if (!product) {
    notFound()
  }

  const related = (await getProductsByCategory(product.category))
    .filter((item) => item.id !== product.id)
    .slice(0, 4)

  const serializedProduct = serializeProduct(product)
  const serializedRelated = serializeProducts(related)

  const image = product.images?.[0] ?? {
    publicId: "samples/ecommerce/analog-classic",
    alt: product.name,
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.availability === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
  }

  const inStock = product.availability === "In Stock"

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="border-b border-[#E5E5E5] bg-white">
        <div className="container-page flex items-center gap-2 py-3.5 text-xs text-slate-400">
          <Link
            href="/"
            className="transition-colors hover:text-slate-700"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/shop"
            className="transition-colors hover:text-slate-700"
          >
            Shop
          </Link>

          <span>/</span>

          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-slate-700"
          >
            {product.category}
          </Link>

          <span>/</span>

          <span className="max-w-[200px] truncate font-medium text-slate-600">
            {product.name}
          </span>
        </div>
      </div>

      <div className="bg-white">
        <div className="container-page py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                <div className="relative aspect-square">
                  <CloudinaryImage
                    src={image.publicId}
                    alt={image.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </Reveal>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={0.1}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                    {product.brand}
                  </span>

                  <span className="text-slate-300">·</span>

                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        inStock
                          ? "bg-emerald-500"
                          : "bg-red-500",
                      ].join(" ")}
                    />
                    {product.availability}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold leading-tight text-[#111111] md:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#111111]">
                    {formatPrice(product.price)}
                  </span>

                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}

                  {product.originalPrice && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                      Save{" "}
                      {formatPrice(
                        product.originalPrice - product.price
                      )}
                    </span>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-5">
                  <ProductActions
                    product={serializedProduct}
                    whatsappNumber={
                      settings.whatsappNumber ||
                      brandConfig.whatsappNumber
                    }
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {trustItems.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2.5 text-xs font-medium text-[#525252]"
                    >
                      <Icon
                        size={14}
                        className="shrink-0 text-[#111111]"
                      />
                      {label}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F8]">
        <div className="container-page py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                <h2 className="mb-5 text-lg font-bold text-[#111111]">
                  Specifications
                </h2>

                <dl className="divide-y divide-[#E5E5E5]">
                  {Object.entries(product.specs).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4 py-3 text-sm"
                      >
                        <dt className="font-medium text-slate-500">
                          {key}
                        </dt>

                        <dd className="text-right font-semibold text-[#111111]">
                          {value}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                <h2 className="mb-5 text-lg font-bold text-[#111111]">
                  Key Features
                </h2>

                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#111111]"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-white">
          <div className="container-page py-14">
            <Reveal>
              <div className="mb-10 flex items-end justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                    More in {product.category}
                  </span>

                  <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">
                    Related Products
                  </h2>
                </div>

                <Link
                  href={`/shop?category=${product.category}`}
                  className="hidden items-center gap-1 text-sm font-semibold text-[#111111] transition hover:gap-2 sm:flex"
                >
                  View all{" "}
                  <ArrowLeft
                    size={14}
                    className="rotate-180"
                  />
                </Link>
              </div>
            </Reveal>

            <ProductGrid products={serializedRelated} />
          </div>
        </div>
      )}
    </div>
  )
}