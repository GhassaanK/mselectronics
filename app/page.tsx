import { ArrowRight, BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Reveal } from "@/components/shared/Motion"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { CloudinaryImage } from "@/components/shared/CloudinaryImage"
import { brandConfig } from "@/config/brand"
import {
  getBrands,
  getCategories,
  getSiteSettings,
  getTestimonials,
} from "@/lib/firebase/catalog"
import { getBestSellers } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"

export const revalidate = 3600

export default async function HomePage() {
  const [settings, categories, brands, bestSellers, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getBrands(),
      getBestSellers(),
      getTestimonials(),
    ])

  const whatsappUrl = buildWhatsAppUrl(
    [],
    settings.whatsappNumber || brandConfig.whatsappNumber
  )

  const serializedBestSellers = serializeProducts(bestSellers)

  return (
    <div>
      <section className="overflow-hidden bg-surface py-2xl md:py-4xl">
        <div className="container-page grid items-center gap-2xl md:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <p className="mb-md text-sm font-semibold uppercase tracking-normal text-accent">
              Premium Appliance Retailer
            </p>

            <h1 className="heading-tight max-w-2xl text-4xl text-foreground md:text-6xl">
              {settings.heroHeadline}
            </h1>

            <p className="mt-lg max-w-xl text-lg leading-relaxed text-muted">
              {settings.heroSubheadline}
            </p>

            <div className="mt-xl flex flex-col gap-sm sm:flex-row">
              <Button asChild>
                <Link href="/shop">
                  Browse Products <ArrowRight size={18} />
                </Link>
              </Button>

              <WhatsAppButton
                href={whatsappUrl}
                label="Start WhatsApp Inquiry"
                sourcePage="homepage-hero"
              />
            </div>
          </Reveal>

          <div className="relative min-h-[320px] rounded-xl bg-background shadow-lift md:min-h-[520px]">
            <CloudinaryImage
              src={settings.heroImage.publicId}
              alt={settings.heroImage.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-xl"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-3xl">
        <SectionHeader
          title="Featured categories"
          description="Shop the appliance categories customers ask for most often."
        />

        <div className="grid grid-cols-2 gap-md md:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="rounded-lg bg-surface p-lg transition duration-premium hover:bg-background hover:shadow-soft"
            >
              <p className="font-semibold">{category.name}</p>

              <p className="mt-sm text-sm text-muted">
                {category.productCount} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-3xl">
        <div className="container-page">
          <SectionHeader
            title="Featured brands"
            description="Trusted names with official-warranty guidance and product support."
          />

          <div className="grid grid-cols-2 gap-md md:grid-cols-5">
            {brands
              .filter((brand) => brand.featured)
              .map((brand) => (
                <Card
                  key={brand.id}
                  className="grid h-24 place-items-center text-xl font-bold"
                >
                  {brand.name}
                </Card>
              ))}
          </div>
        </div>
      </section>

      <section className="container-page py-3xl">
        <SectionHeader
          eyebrow="Best sellers"
          title="Popular picks for modern homes"
        />

        <ProductGrid products={serializedBestSellers} />
      </section>

      <section className="container-page grid gap-lg py-3xl md:grid-cols-4">
        {[
          ["Official guidance", BadgeCheck],
          ["Warranty support", ShieldCheck],
          ["Delivery help", Truck],
          ["Installment options", CreditCard],
        ].map(([label, Icon]) => (
          <Card key={String(label)} className="p-lg">
            <Icon className="mb-md text-primary" size={28} />

            <h3 className="font-bold">{String(label)}</h3>

            <p className="mt-sm text-sm leading-relaxed text-muted">
              Get clear answers before you confirm your appliance purchase.
            </p>
          </Card>
        ))}
      </section>

      <section className="bg-primary-gradient py-3xl text-white">
        <div className="container-page flex flex-col gap-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="heading-tight text-3xl">
              {settings.installmentTitle}
            </h2>

            <p className="mt-md max-w-2xl text-white/80">
              {settings.installmentDescription}
            </p>
          </div>

          <WhatsAppButton
            href={whatsappUrl}
            label="Ask About Installments"
            sourcePage="homepage-installments"
          />
        </div>
      </section>

      <section className="container-page py-3xl">
        <SectionHeader title="Customers trust MS Electronics" />

        <div className="grid gap-md md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.id} className="p-lg">
              <p className="leading-relaxed text-muted">
                "{item.text}"
              </p>

              <p className="mt-md font-semibold">{item.name}</p>

              <p className="text-sm text-muted">{item.city}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-md bottom-md z-40 md:hidden">
        <WhatsAppButton
          href={whatsappUrl}
          label="WhatsApp Inquiry"
          sourcePage="homepage-mobile-sticky"
        />
      </div>
    </div>
  )
}