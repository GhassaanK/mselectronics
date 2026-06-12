import Image from "next/image"
import Link from "next/link"
import { brandConfig } from "@/config/brand"

const browse = [
  { href: "/shop",       label: "Shop All" },
  { href: "/brands",     label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/cart",       label: "Inquiry Cart" },
]

const company = [
  { href: "/about",   label: "About Us" },
  { href: "/contact", label: "Contact Information" },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#F5F5F5] text-[#111111]">

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
              className="h-9 w-auto"
            />
          ) : (
            <span className="text-lg font-extrabold text-[#111111]">
              {brandConfig.companyName}
            </span>
          )}
          <div className="space-y-1.5 text-sm text-[#525252]">
            <p><span className="font-semibold text-[#111111]">Address:</span> {brandConfig.contactInfo.address}</p>
            <p>
              <span className="font-semibold text-[#111111]">Email: </span>
              <a href={`mailto:${brandConfig.contactInfo.email}`} className="transition-colors hover:text-[#111111]">
                {brandConfig.contactInfo.email}
              </a>
            </p>
            <p>
              <span className="font-semibold text-[#111111]">Phone: </span>
              <a href={`tel:${brandConfig.contactInfo.phone}`} className="transition-colors hover:text-[#111111]">
                {brandConfig.contactInfo.phone}
              </a>
            </p>
          </div>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: brandConfig.socialLinks.facebook,  label: "Facebook",  char: "f" },
              { href: brandConfig.socialLinks.instagram, label: "Instagram", char: "ig" },
              { href: brandConfig.socialLinks.tiktok,    label: "TikTok",    char: "tt" },
            ].map(({ href, label, char }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CCCCCC] text-xs font-bold text-[#525252] transition-all duration-200 hover:border-[#111111] hover:text-[#111111]"
              >
                {char}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-[#111111]">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {browse.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#525252] transition-colors hover:text-[#111111]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-[#111111]">
            Information
          </h3>
          <ul className="space-y-3">
            {company.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#525252] transition-colors hover:text-[#111111]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-3 text-base font-bold text-[#111111]">
            Sign Up for Email Newsletter
          </h3>
          <p className="mb-4 text-sm text-[#525252]">
            Subscribe to receive updates on new arrivals, sales, and exclusive content.
          </p>
          <div className="flex gap-0">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 rounded-l-lg border border-[#CCCCCC] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#111111]"
            />
            <button className="rounded-r-lg bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#262626]">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ──────────────────────────────────── */}
      <div className="border-t border-gray-200">
        <div className="container-page flex items-center justify-center py-4 text-xs text-[#888888]">
          <p>© {new Date().getFullYear()} {brandConfig.companyName} — All rights reserved.</p>
        </div>
      </div>

    </footer>
  )
}