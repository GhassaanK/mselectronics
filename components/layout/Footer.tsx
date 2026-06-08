import Image from "next/image"
import Link from "next/link"
import { brandConfig } from "@/config/brand"

export function Footer() {
  return (
    <footer className="mt-4xl bg-surface py-3xl">
      <div className="container-page grid gap-xl md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src={brandConfig.logo} alt={brandConfig.companyName} width={180} height={44} className="mb-md h-10 w-auto" />
          <p className="max-w-md leading-relaxed text-muted">{brandConfig.companyDescription}</p>
        </div>
        <div>
          <h3 className="mb-md text-sm font-bold uppercase tracking-normal">Browse</h3>
          <div className="grid gap-sm text-sm text-muted">
            <Link href="/shop">Products</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/cart">Inquiry Cart</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-md text-sm font-bold uppercase tracking-normal">Contact</h3>
          <div className="grid gap-sm text-sm text-muted">
            <p>{brandConfig.contactInfo.address}</p>
            <p>{brandConfig.contactInfo.phone}</p>
            <p>{brandConfig.contactInfo.email}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
