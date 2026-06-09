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
import { Reveal, StaggerChild, StaggerParent } from "@/components/shared/Motion"
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
    openGraph: {
      title: product.name,
      description: `${formatPrice(product.price)} · ${product.availability}`,
    },
  }
}

const trustItems = [
  { icon: BadgeCheck,  label: "Authorised dealer" },
  { icon: ShieldCheck, label: "Official warranty" },
  { icon: Truck,       label: "Same-week delivery" },
  { icon: CreditCard,  label: "Installment options" },
]

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const [product, settings] = await Promise.all([
    getProductById(id),
    getSiteSettings(),
  ])
  if (!product) notFound()

  const related           = (await getProductsByCategory(product.category))
    .filter((item) => item.id !== product.id)
    .slice(0, 4)
  const serializedProduct = serializeProduct(product)
  const serializedRelated = serializeProducts(related)
  const image             = product.images?.[0] ?? {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb band ───────────────────────────────── */}
      <div className="border-b border-[#E8ECF4] bg-white">
        <div className="container-page flex items-center gap-2 py-3.5 text-xs text-slate-400">
          <Link href="/" className="transition-colors hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-slate-700">Shop</Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-slate-700"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* ── Main product section ──────────────────────────── */}
      <div className="bg-white">
        <div className="container-page py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">

            {/* Image panel */}
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-[#E8ECF4] bg-[#F7F8FC] p-6 shadow-[0_2px_16px_rgb(10,15,30,0.06)]">
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

            {/* Info panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={0.1}>

                {/* Brand + availability */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold uppercase tracking-widest text-blue-600"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {product.brand}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        inStock ? "bg-emerald-500" : "bg-amber-500",
                      ].join(" ")}
                    />
                    {product.availability}
                  </span>
                </div>

                {/* Name */}
                <h1
                  className="mt-3 text-2xl font-extrabold leading-tight text-[#0A0F1E] md:text-3xl"
                  style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
                >
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-3">
                  <span
                    className="text-3xl font-extrabold text-[#0A0F1E]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* CTA panel */}
                <div className="mt-6 rounded-2xl border border-[#E8ECF4] bg-[#F7F8FC] p-5">
                  <ProductActions
                    product={serializedProduct}
                    whatsappNumber={settings.whatsappNumber || brandConfig.whatsappNumber}
                  />
                </div>

                {/* Trust row */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {trustItems.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-[#E8ECF4] bg-white px-3 py-2.5 text-xs font-medium text-slate-500"
                    >
                      <Icon size={14} className="shrink-0 text-blue-500" />
                      {label}
                    </div>
                  ))}
                </div>

              </Reveal>
            </div>

          </div>
        </div>
      </div>

      {/* ── Specs + Features ──────────────────────────────── */}
      <div className="bg-[#F7F8FC]">
        <div className="container-page py-14">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Specifications */}
            <Reveal>
              <div className="rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.05)]">
                <h2
                  className="mb-5 text-lg font-bold text-[#0A0F1E]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Specifications
                </h2>
                <dl className="divide-y divide-[#F0F2F7]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <dt className="font-medium text-slate-500">{key}</dt>
                      <dd className="text-right font-semibold text-[#0A0F1E]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Features */}
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.05)]">
                <h2
                  className="mb-5 text-lg font-bold text-[#0A0F1E]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-500"
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

      {/* ── Related products ──────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-white">
          <div className="container-page py-14">
            <Reveal>
              <div className="mb-10 flex items-end justify-between">
                <div className="space-y-1.5">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    More in {product.category}
                  </span>
                  <h2
                    className="text-2xl font-bold text-[#0A0F1E] md:text-3xl"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
                  >
                    Related Products
                  </h2>
                </div>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:gap-2 sm:flex"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  View all <ArrowLeft size={14} className="rotate-180" />
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