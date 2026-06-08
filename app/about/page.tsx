import type { Metadata } from "next"
import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { brandConfig } from "@/config/brand"

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } }

export default function AboutPage() {
  return (
    <section className="container-page py-2xl">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">About MS Electronics</p>
        <h1 className="heading-tight mt-sm text-4xl md:text-5xl">{brandConfig.companyName}</h1>
        <p className="mt-lg text-lg leading-relaxed text-muted">{brandConfig.companyDescription}</p>
      </div>
      <div className="mt-2xl grid gap-md md:grid-cols-3">
        {[
          ["Curated appliances", BadgeCheck],
          ["Clear guidance", HeartHandshake],
          ["Reliable support", ShieldCheck]
        ].map(([label, Icon]) => (
          <Card key={String(label)} className="p-lg">
            <Icon className="mb-md text-primary" size={28} />
            <h2 className="font-bold">{String(label)}</h2>
            <p className="mt-sm text-sm leading-relaxed text-muted">A premium buying experience centered on product clarity and WhatsApp support.</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
