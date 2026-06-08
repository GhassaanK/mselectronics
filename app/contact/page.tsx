import type { Metadata } from "next"
import { MapPin, Phone } from "lucide-react"
import { Card } from "@/components/ui/card"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { brandConfig } from "@/config/brand"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } }

export default function ContactPage() {
  return (
    <section className="container-page py-2xl">
      <div className="max-w-3xl">
        <h1 className="heading-tight text-4xl md:text-5xl">Contact MS Electronics</h1>
        <p className="mt-md text-lg leading-relaxed text-muted">Send a WhatsApp inquiry or reach us for appliance availability, warranty, delivery, and installment guidance.</p>
      </div>
      <div className="mt-xl grid gap-md md:grid-cols-2">
        <Card className="p-lg">
          <MapPin className="mb-md text-primary" />
          <h2 className="font-bold">Visit</h2>
          <p className="mt-sm text-muted">{brandConfig.contactInfo.address}</p>
        </Card>
        <Card className="p-lg">
          <Phone className="mb-md text-primary" />
          <h2 className="font-bold">Call</h2>
          <p className="mt-sm text-muted">{brandConfig.contactInfo.phone}</p>
        </Card>
      </div>
      <div className="mt-xl">
        <WhatsAppButton href={buildWhatsAppUrl([], brandConfig.whatsappNumber)} label="Message on WhatsApp" sourcePage="contact" />
      </div>
    </section>
  )
}
