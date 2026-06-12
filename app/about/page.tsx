import type { Metadata } from "next"
import { BadgeCheck, HeartHandshake, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
import { Reveal, StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { brandConfig } from "@/config/brand"

export const metadata: Metadata = {
  title: "About Us",
  alternates: { canonical: "/about" },
}

const values = [
  {
    icon: BadgeCheck,
    title: "Authorised Only",
    desc: "We only stock what we can stand behind. Every product comes through official distribution — no grey market, ever.",
  },
  {
    icon: HeartHandshake,
    title: "Honest Guidance",
    desc: "We'd rather lose a sale than recommend something that isn't right. Clear advice is the only kind we give.",
  },
  {
    icon: ShieldCheck,
    title: "Full Warranty Support",
    desc: "When something goes wrong, we don't disappear. We help you navigate manufacturer warranty from start to finish.",
  },
]

const stats = [
  { value: "500+", label: "Products in stock" },
  { value: "10+",  label: "Brands available" },
  { value: "5★",   label: "Customer rating" },
  { value: "KHI",  label: "Based in Karachi" },
]

export default function AboutPage() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] pb-14 pt-12">
        <div className="container-page">
          <Reveal>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
              Our Story
            </p>
            <h1 className="max-w-2xl text-4xl font-bold text-[#111111] md:text-5xl">
              {brandConfig.companyName}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#666666] md:text-base">
              {brandConfig.companyDescription}
            </p>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.12}>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-5">
                  <p className="text-2xl font-extrabold text-[#111111]">{value}</p>
                  <p className="mt-1 text-xs text-[#AAAAAA]">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Story section ─────────────────────────────────── */}
      <div className="bg-white">
        <div className="container-page py-14">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
                <span className="h-px w-5 bg-[#CCCCCC]" />
                What We Believe
              </span>
              <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">
                Buying an appliance should feel good.
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#525252] md:text-base">
                <p>
                  Too many people end up with the wrong appliance — bought on hype, sold by someone who just wanted the commission. We started MS Electronics because we wanted to do it differently.
                </p>
                <p>
                  We ask the right questions first. What&apos;s your kitchen size? How often does the family cook? Is this a first home or an upgrade? The answers shape what we recommend — not the margin.
                </p>
                <p>
                  Every product we carry comes through official distribution. Every sale comes with real after-sales support. That&apos;s what we&apos;re proud of.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Values ────────────────────────────────────────── */}
      <div className="bg-[#F8F8F8]">
        <div className="container-page py-14">
          <Reveal>
            <div className="mb-8 space-y-1">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
                <span className="h-px w-5 bg-[#CCCCCC]" />
                Our Values
              </span>
              <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">How we work</h2>
            </div>
          </Reveal>

          <StaggerParent className="grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <StaggerChild key={title}>
                <div className="flex flex-col gap-4 rounded-xl border border-[#E5E5E5] bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-sm font-bold text-[#111111]">{title}</h3>
                    <p className="text-sm leading-relaxed text-[#666666]">{desc}</p>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div className="border-t border-[#E5E5E5] bg-[#F8F8F8]">
        <div className="container-page py-14">
          <Reveal>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E5E5] bg-white">
                <Zap size={20} className="text-[#525252]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">
                Ready to find the right appliance?
              </h2>
              <p className="max-w-md text-sm text-[#666666]">
                Browse our full catalogue or start a WhatsApp conversation and we&apos;ll guide you from there.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-primary">Browse Products</Link>
                <Link href="/contact" className="btn-ghost">Contact Us</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  )
}