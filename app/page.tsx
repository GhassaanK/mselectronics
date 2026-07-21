import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { HeroSlider } from "@/components/layout/HeroSlider"
import { SocialDrawer } from "@/components/layout/SocialDrawer"
import { CategoryTabProducts } from "@/components/shop/CategoryTabProducts"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Reveal, StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { brandConfig } from "@/config/brand"
import { getBanners } from "@/lib/firebase/banners"
import {
  getBrands,
  getCategories,
  getSiteSettings,
  getTestimonials,
} from "@/lib/firebase/catalog"
import { getBestSellers, getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import type { Category } from "@/types"

export const revalidate = 30

const trustItems = [
  { icon: BadgeCheck, stat: "100%", label: "Authentic, official store" },
  { icon: Zap, stat: "EMI", label: "Easy monthly installments" },
  { icon: ShieldCheck, stat: "1 yr+", label: "Brand warranty included" },
  { icon: Truck, stat: "7 days", label: "Same-week Karachi delivery" },
]

export default async function HomePage() {
  const [settings, categories, brands, bestSellers, testimonials, banners, allProducts] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getBrands(),
      getBestSellers(),
      getTestimonials(),
      getBanners(),
      getProducts(),
    ])

  const whatsappUrl = buildWhatsAppUrl(
    [],
    settings.whatsappNumber || brandConfig.whatsappNumber
  )

  const activeBanners = banners.filter((b) => b.active)
  const serializedBestSellers = serializeProducts(bestSellers)
  const serializedAllProducts = serializeProducts(allProducts)
  const featuredBrands = brands.filter((b) => b.featured)
  const marqueeBrands = [...featuredBrands, ...featuredBrands]

  // Build per-category product map for the tabbed section
  const productsByCategory: Record<string, ReturnType<typeof serializeProducts>> = {}
  for (const cat of categories) {
    const catProducts = serializedAllProducts.filter(
      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
    )
    if (catProducts.length > 0) productsByCategory[cat.slug] = catProducts
  }

  return (
    <div className="overflow-x-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SOCIAL DRAWER — fixed, vertical-center, left edge
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SocialDrawer />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO SLIDER (full-bleed, data-driven)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HeroSlider banners={activeBanners} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. TRUST BAR — stat-forward, single row, all devices
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-6 border-b border-[#E8ECF4] sm:py-8">
        <div className="container-page">
          <StaggerParent className="grid grid-cols-2 divide-y divide-[#E8ECF4] overflow-hidden rounded-2xl border border-[#E8ECF4] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {trustItems.map(({ icon: Icon, stat, label }, i) => (
              <StaggerChild key={label}>
                <div
                  className={[
                    "group flex flex-col gap-1 px-4 py-5 transition-colors duration-300 hover:bg-[#FAFBFD] sm:px-5 sm:py-6",
                    i % 2 === 0 ? "border-r border-[#E8ECF4] sm:border-r-0" : "",
                  ].join(" ")}
                >
                  <Icon size={18} className="mb-1 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                  <p
                    className="text-[1.6rem] font-bold leading-none text-[#0A0F1E] sm:text-[1.85rem]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {stat}
                  </p>
                  <p className="text-xs leading-snug text-slate-500 sm:text-[0.8rem]">
                    {label}
                  </p>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SHOP BY CATEGORY — visual grid
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#F7F8FC] section-py">
        <div className="container-page">

          <Reveal>
            <div className="responsive-section-head mb-8 sm:mb-10">
              <div className="space-y-2">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-blue-600" />
                  Shop by Category
                </span>
                <h2 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
                  What are you looking for?
                </h2>
              </div>
              <Link
                href="/categories"
                className="hidden items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all hover:gap-2.5 sm:flex"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                All categories <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <StaggerParent className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-4 md:grid-cols-4">
            {categories.slice(0, 8).map((category: Category) => {
              return (
                <StaggerChild key={category.id}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className={[
                      "group relative overflow-hidden rounded-2xl border border-[#E8ECF4] bg-white",
                      "shadow-[0_2px_12px_rgb(10,15,30,0.05)]",
                      "transition-all duration-300 hover:-translate-y-1 hover:border-blue-200",
                      "hover:shadow-[0_10px_32px_rgb(28,78,216,0.1)]",
                    ].join(" ")}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F8FC]">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 25vw, 50vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#F7F8FC]" />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-5">
                      <div>
                        <p
                          className="text-sm font-bold text-[#0A0F1E]"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {category.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {category.productCount} products
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-blue-600 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </StaggerChild>
              )
            })}
          </StaggerParent>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. BRANDS MARQUEE STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {featuredBrands.length > 0 && (
        <section className="border-y border-[#E8ECF4] bg-white py-5 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
            <div className="flex min-w-max animate-marquee items-center gap-14">
              {marqueeBrands.map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/shop?brand=${brand.slug}`}
                  className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-transparent bg-white px-6 transition-all duration-300 hover:border-[#E8ECF4]"
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={176}
                      height={48}
                      className="h-12 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                    />
                  ) : (
                    <span
                      className="text-sm font-bold uppercase tracking-wider text-slate-400"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. BEST SELLERS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white section-py">
        <div className="container-page">
          <Reveal>
            <div className="responsive-section-head mb-8 sm:mb-10">
              <div className="space-y-2">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-blue-600" />
                  Best Sellers
                </span>
                <h2 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
                  Popular picks for modern homes
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all hover:gap-2.5 sm:flex"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <ProductGrid products={serializedBestSellers} />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. MID-PAGE BANNER — dark, full-bleed
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden bg-[#0A0F1E] py-12 sm:py-16 lg:py-20">
        <div className="container-page relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl space-y-3">
            <span className="eyebrow text-blue-400">
              <span className="h-px w-6 bg-blue-500" />
              Flexible Payments
            </span>
            <h2
              className="text-3xl font-extrabold text-white md:text-4xl"
              style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
            >
              {settings.installmentTitle || "Pay in easy installments."}
            </h2>
            <p className="text-base leading-relaxed text-white/50">
              {settings.installmentDescription ||
                "Ask us about monthly payment plans. We'll walk you through every option before you commit."}
            </p>
          </div>
          <WhatsAppButton
            href={whatsappUrl}
            label="Ask About Installments"
            sourcePage="homepage-installments"
          />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. BROWSE BY CATEGORY — tabbed product rows
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {Object.keys(productsByCategory).length > 0 && (
        <section className="bg-[#F7F8FC] section-py">
          <div className="container-page">
            <Reveal>
              <div className="mb-10 space-y-2">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-blue-600" />
                  Browse by Category
                </span>
                <h2 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
                  Find exactly what you need
                </h2>
              </div>
            </Reveal>
            <CategoryTabProducts
              categories={categories}
              productsByCategory={productsByCategory}
            />
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          8. TESTIMONIALS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white section-py">
        <div className="container-page">
          <Reveal>
            <div className="mb-10 space-y-2 text-center">
              <span className="eyebrow justify-center">
                <span className="h-px w-6 bg-blue-600" />
                Customer Reviews
                <span className="h-px w-6 bg-blue-600" />
              </span>
              <h2 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
                Karachi trusts MS Electronics
              </h2>
            </div>
          </Reveal>

          <StaggerParent className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <StaggerChild key={item.id}>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-[#F7F8FC] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(10,15,30,0.08)]">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 fill-blue-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="border-t border-[#E8ECF4] pt-4">
                    <p
                      className="text-sm font-semibold text-[#0A0F1E]"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{item.city}</p>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. BOTTOM CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#F7F8FC] section-py-sm">
        <Reveal>
          <div className="container-page flex flex-col items-center gap-5 text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-6 bg-blue-600" />
              Ready to buy?
              <span className="h-px w-6 bg-blue-600" />
            </span>
            <h2
              className="max-w-xl text-3xl font-bold text-[#0A0F1E] md:text-4xl"
              style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
            >
              Not sure what you need? Just ask.
            </h2>
            <p className="max-w-md text-base text-slate-500">
              Drop us a WhatsApp message and our team will help you pick the
              right appliance at the right price.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className="btn-primary">
                Browse Products <ArrowRight size={16} />
              </Link>
              <WhatsAppButton
                href={whatsappUrl}
                label="Chat on WhatsApp"
                sourcePage="homepage-bottom-cta"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE STICKY WHATSAPP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="fixed bottom-4 inset-x-4 z-40 md:hidden">
        <WhatsAppButton
          href={whatsappUrl}
          label="WhatsApp Inquiry"
          sourcePage="homepage-mobile-sticky"
        />
      </div>

    </div>
  )
}
