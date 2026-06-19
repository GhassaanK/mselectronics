"use client"

import { useState } from "react"
import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { ProductImageGallery } from "@/components/shop/ProductImageGallery"
import { ProductActions } from "@/components/shop/ProductActions"
import { VariantSelector } from "@/components/shop/VariantSelector"
import { Reveal } from "@/components/shared/Motion"
import { formatPrice } from "@/lib/utils/format"
import type { ColorVariant, SerializableProduct, SizeVariant } from "@/types"

const trustItems = [
  { icon: BadgeCheck,  label: "Authorised dealer"  },
  { icon: ShieldCheck, label: "Official warranty"   },
  { icon: Truck,       label: "Same-week delivery"  },
  { icon: CreditCard,  label: "Installment options" },
]

type Props = {
  product: SerializableProduct
  whatsappNumber: string
}

export function ProductDetailClient({ product, whatsappNumber }: Props) {
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(null)
  const [activeSize, setActiveSize]   = useState<SizeVariant | null>(null)

  // Derived active values — fall back to base product
  const activeImages   = activeColor?.images ?? product.images
  const activePrice    = activeSize?.price    ?? product.price
  const activeOriginal = activeSize?.originalPrice ?? product.originalPrice
  const activeSpecs    = activeSize?.specs    ?? product.specs
  const activeFeatures = activeSize?.features ?? product.features
  const activeAvail    = activeSize?.availability ?? product.availability

  const inStock = activeAvail === "In Stock"

  // Build a label string for the WhatsApp message, e.g. "1.5 Ton — Silver"
  const variantLabel = [activeSize?.label, activeColor?.label]
    .filter(Boolean)
    .join(" — ") || undefined

  // Give ProductActions an enriched product reflecting active variant state
  const activeProduct: SerializableProduct = {
    ...product,
    price: activePrice,
    originalPrice: activeOriginal,
    availability: activeAvail,
  }

  const colorVariants = product.colorVariants ?? []
  const sizeVariants  = product.sizeVariants  ?? []

  return (
    <>
      {/* Main product section */}
      <div className="bg-white">
        <div className="container-page py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <ProductImageGallery
                images={activeImages}
                productName={product.name}
              />
            </Reveal>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={0.1}>
                {/* Brand + availability */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                    {product.brand}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className={[
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                  ].join(" ")}>
                    <span className={[
                      "h-1.5 w-1.5 rounded-full",
                      inStock ? "bg-emerald-500" : "bg-red-500",
                    ].join(" ")} />
                    {activeAvail}
                  </span>
                </div>

                {/* Name */}
                <h1 className="mt-3 text-2xl font-extrabold leading-tight text-[#111111] md:text-3xl">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#111111]">
                    {formatPrice(activePrice)}
                  </span>
                  {activeOriginal && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatPrice(activeOriginal)}
                      </span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                        Save {formatPrice(activeOriginal - activePrice)}
                      </span>
                    </>
                  )}
                </div>

                {/* Variant selectors */}
                {(colorVariants.length > 0 || sizeVariants.length > 0) && (
                  <div className="mt-5">
                    <VariantSelector
                      colorVariants={colorVariants}
                      sizeVariants={sizeVariants}
                      activeColorId={activeColor?.id ?? null}
                      activeSizeId={activeSize?.id ?? null}
                      onColorChange={setActiveColor}
                      onSizeChange={setActiveSize}
                    />
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-5">
                  <ProductActions
                    product={activeProduct}
                    whatsappNumber={whatsappNumber}
                    variantLabel={variantLabel}
                  />
                </div>

                {/* Trust badges */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {trustItems.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2.5 text-xs font-medium text-[#525252]"
                    >
                      <Icon size={14} className="shrink-0 text-[#111111]" />
                      {label}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Specs + Features */}
      <div className="bg-[#F8F8F8]">
        <div className="container-page py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                <h2 className="mb-5 text-lg font-bold text-[#111111]">Specifications</h2>
                <dl className="divide-y divide-[#E5E5E5]">
                  {Object.entries(activeSpecs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <dt className="font-medium text-slate-500">{key}</dt>
                      <dd className="text-right font-semibold text-[#111111]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                <h2 className="mb-5 text-lg font-bold text-[#111111]">Key Features</h2>
                <ul className="space-y-3">
                  {activeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#111111]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}