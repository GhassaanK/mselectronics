import Image from "next/image"
import Link from "next/link"
import { brandConfig } from "@/config/brand"

const browse = [
  { href: "/shop",       label: "Products" },
  { href: "/brands",     label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/cart",       label: "Inquiry Cart" },
]

const company = [
  { href: "/about",   label: "About Us" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="bg-[#0A0F1E] text-white/70">

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="container-page grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr_1.4fr]">

        {/* Brand column */}
        <div className="space-y-5">
          {brandConfig.logo ? (
            <Image
              src={brandConfig.logo}
              alt={brandConfig.companyName}
              width={160}
              height={40}
              className="h-9 w-auto brightness-0 invert"
            />
          ) : (
            <span
              className="text-lg font-extrabold text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {brandConfig.companyName}
            </span>
          )}
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            {brandConfig.companyDescription}
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: brandConfig.socialLinks.facebook,  label: "Facebook",  icon: "f" },
              { href: brandConfig.socialLinks.instagram, label: "Instagram", icon: "ig" },
              { href: brandConfig.socialLinks.tiktok,    label: "TikTok",    icon: "tt" },
            ].map(({ href, label, icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-white/40 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/10 hover:text-white"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Browse */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white/30" style={{ fontFamily: "'Sora', sans-serif" }}>
            Browse
          </h3>
          <ul className="space-y-3">
            {browse.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-150 hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white/30" style={{ fontFamily: "'Sora', sans-serif" }}>
            Company
          </h3>
          <ul className="space-y-3">
            {company.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-150 hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white/30" style={{ fontFamily: "'Sora', sans-serif" }}>
            Get in Touch
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="leading-relaxed text-white/50">
              {brandConfig.contactInfo.address}
            </li>
            <li>
              <a
                href={`tel:${brandConfig.contactInfo.phone}`}
                className="transition-colors hover:text-white"
              >
                {brandConfig.contactInfo.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${brandConfig.contactInfo.email}`}
                className="transition-colors hover:text-white"
              >
                {brandConfig.contactInfo.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/30 sm:flex-row">
          <p>© {new Date().getFullYear()} {brandConfig.companyName}. All rights reserved.</p>
          <p>Built with care in Karachi, Pakistan.</p>
        </div>
      </div>

    </footer>
  )
}