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
    color: "blue",
  },
  {
    icon: HeartHandshake,
    title: "Honest Guidance",
    desc: "We'd rather lose a sale than recommend something that isn't right. Clear advice is the only kind we give.",
    color: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Full Warranty Support",
    desc: "When something goes wrong, we don't disappear. We help you navigate manufacturer warranty from start to finish.",
    color: "purple",
  },
]

const colorMap: Record<string, string> = {
  blue:    "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple:  "bg-purple-50 text-purple-600",
}

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
      <div className="relative overflow-hidden bg-[#0A0F1E] pb-20 pt-20">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(28,78,216,0.22) 0%, transparent 68%)" }}
        />

        <div className="container-page relative">
          <Reveal>
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-blue-400"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Our Story
            </p>
            <h1
              className="max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-5xl"
              style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
            >
              {brandConfig.companyName}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
              {brandConfig.companyDescription}
            </p>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.15}>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5"
                >
                  <p
                    className="text-2xl font-extrabold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Story section ─────────────────────────────────── */}
      <div className="bg-white">
        <div className="container-page py-16">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <span
                className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <span className="h-px w-6 bg-blue-600" />
                What We Believe
              </span>
              <h2
                className="text-2xl font-extrabold text-[#0A0F1E] md:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                Buying an appliance should feel good.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-500">
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
      <div className="bg-[#F7F8FC]">
        <div className="container-page py-16">
          <Reveal>
            <div className="mb-10 space-y-2">
              <span
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <span className="h-px w-6 bg-blue-600" />
                Our Values
              </span>
              <h2
                className="text-2xl font-extrabold text-[#0A0F1E] md:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                How we work
              </h2>
            </div>
          </Reveal>

          <StaggerParent className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <StaggerChild key={title}>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.06)]">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3
                      className="mb-2 text-base font-bold text-[#0A0F1E]"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div className="bg-[#0A0F1E]">
        <div className="container-page py-16">
          <Reveal>
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/20">
                <Zap size={24} className="text-blue-400" />
              </div>
              <h2
                className="text-2xl font-extrabold text-white md:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                Ready to find the right appliance?
              </h2>
              <p className="max-w-md text-base text-white/50">
                Browse our full catalogue or start a WhatsApp conversation and we&apos;ll guide you from there.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-primary">
                  Browse Products
                </Link>
                <Link href="/contact" className="btn-ghost" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  )
}