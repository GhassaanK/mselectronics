import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Reveal } from "@/components/shared/Motion"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { brandConfig } from "@/config/brand"
import {
  getBrands,
  getCategories,
  getSiteSettings,
  getTestimonials,
} from "@/lib/firebase/catalog"
import { getBanners } from "@/lib/firebase/banners"
import { getBestSellers } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import { HeroBannerSlider } from "@/components/shared/HeroBannerSlider"

export const revalidate = 3600

export default async function HomePage() {
  const [settings, categories, brands, bestSellers, testimonials, banners] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getBrands(),
      getBestSellers(),
      getTestimonials(),
      getBanners(),
    ])

  const whatsappUrl = buildWhatsAppUrl(
    [],
    settings.whatsappNumber || brandConfig.whatsappNumber
  )

  const serializedBestSellers = serializeProducts(bestSellers)
  const featuredBrands = brands.filter((b) => b.featured)
  const marqueeBrands = [...featuredBrands, ...featuredBrands]

  return (
    <div className="overflow-x-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO BANNER SLIDER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HeroBannerSlider banners={banners} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BRANDS MARQUEE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-y border-white/8 bg-[#0D1526] py-4">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0D1526] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0D1526] to-transparent" />
          <div className="flex animate-marquee items-center gap-16 whitespace-nowrap">
            {marqueeBrands.map((brand, i) => (
              <span
                key={`${brand.id}-${i}`}
                className="text-base font-bold uppercase tracking-widest text-white/25 transition-colors duration-200 hover:text-white/60"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CATEGORIES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-py bg-[#F7F8FC]">
        <div className="container-page">

          <Reveal>
            <div className="mb-12 flex items-end justify-between">
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
                className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:gap-2 sm:flex"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                All categories <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category, i) => (
              <Reveal key={category.id} delay={i * 0.05}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-[#E8ECF4] bg-white px-4 py-6 text-center shadow-[0_2px_12px_rgb(10,15,30,0.06)] transition-all duration-250 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(28,78,216,0.12)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F4FF] text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0F1E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {category.productCount} items
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BEST SELLERS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-py bg-white">
        <div className="container-page">

          <Reveal>
            <div className="mb-12 flex items-end justify-between">
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
                className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:gap-2 sm:flex"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <ProductGrid products={serializedBestSellers} />

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHY US
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-py bg-[#F7F8FC]">
        <div className="container-page">

          <Reveal>
            <div className="mb-12 space-y-2 text-center">
              <span className="eyebrow justify-center">
                <span className="h-px w-6 bg-blue-600" />
                Why MS Electronics
                <span className="h-px w-6 bg-blue-600" />
              </span>
              <h2 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
                Every purchase, fully supported
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BadgeCheck,
                title: "Authorised Dealer",
                desc:  "Every product is sourced through official channels. No grey market, no risk.",
                color: "blue",
              },
              {
                icon: ShieldCheck,
                title: "Warranty Support",
                desc:  "We guide you through every step of official manufacturer warranty claims.",
                color: "emerald",
              },
              {
                icon: Truck,
                title: "Same-Week Delivery",
                desc:  "Fast, careful delivery across Karachi and surrounding areas.",
                color: "orange",
              },
              {
                icon: CreditCard,
                title: "Easy Installments",
                desc:  "Flexible plans so you can bring home the appliance you actually want.",
                color: "purple",
              },
            ].map(({ icon: Icon, title, desc, color }, i) => {
              const colorMap: Record<string, string> = {
                blue:    "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                orange:  "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
                purple:  "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
              }
              return (
                <Reveal key={title} delay={i * 0.08}>
                  <div className="group flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(10,15,30,0.1)]">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${colorMap[color]}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="mb-1.5 text-base font-bold text-[#0A0F1E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INSTALLMENT CTA BANNER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden bg-[#0A0F1E] py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(28,78,216,0.25) 0%, transparent 70%)" }}
        />
        <div className="container-page relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="eyebrow text-blue-400">
              <span className="h-px w-6 bg-blue-500" />
              Flexible Payments
            </span>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl" style={{ fontFamily: "'Sora', sans-serif" }}>
              {settings.installmentTitle || "Pay in easy installments — zero stress."}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TESTIMONIALS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-py bg-white">
        <div className="container-page">

          <Reveal>
            <div className="mb-12 space-y-2 text-center">
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

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-[#F7F8FC] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(10,15,30,0.08)]">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="border-t border-[#E8ECF4] pt-4">
                    <p className="text-sm font-semibold text-[#0A0F1E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{item.city}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-py-sm bg-[#F7F8FC]">
        <Reveal>
          <div className="container-page flex flex-col items-center gap-5 text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-6 bg-blue-600" />
              Ready to buy?
              <span className="h-px w-6 bg-blue-600" />
            </span>
            <h2 className="max-w-xl text-3xl font-bold text-[#0A0F1E] md:text-4xl" style={{ fontFamily: "'Sora', sans-serif" }}>
              Not sure what you need? Just ask.
            </h2>
            <p className="max-w-md text-base text-slate-500">
              Drop us a WhatsApp message and our team will help you pick the right appliance at the right price.
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE STICKY WHATSAPP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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