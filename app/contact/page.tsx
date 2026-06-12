import type { Metadata } from "next"
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { Reveal } from "@/components/shared/Motion"
import { brandConfig } from "@/config/brand"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
}

const contactItems = [
  { icon: MapPin,  label: "Visit Us",       value: brandConfig.contactInfo.address,            color: "bg-[#F8F8F8] text-[#525252]", action: null },
  { icon: Phone,   label: "Call Us",        value: brandConfig.contactInfo.phone,               color: "bg-[#F8F8F8] text-[#525252]", action: `tel:${brandConfig.contactInfo.phone}` },
  { icon: Mail,    label: "Email Us",       value: brandConfig.contactInfo.email,               color: "bg-[#F8F8F8] text-[#525252]", action: `mailto:${brandConfig.contactInfo.email}` },
  { icon: Clock,   label: "Business Hours", value: "Mon – Sat, 10 AM – 8 PM",                  color: "bg-[#F8F8F8] text-[#525252]", action: null },
]

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl([], brandConfig.whatsappNumber)

  return (
    <div>

      {/* ── Page hero ─────────────────────────────────────── */}
      <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] pb-12 pt-12">
        <div className="container-page max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
            Get in Touch
          </p>
          <h1 className="text-3xl font-bold text-[#111111] md:text-4xl">
            Contact MS Electronics
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#666666] md:text-base">
            Questions about availability, warranty, delivery, or installments?
            We&apos;re a WhatsApp message away.
          </p>
          <div className="mt-6">
            <WhatsAppButton
              href={whatsappUrl}
              label="Message us on WhatsApp"
              sourcePage="contact-hero"
            />
          </div>
        </div>
      </div>

      {/* ── Contact cards ─────────────────────────────────── */}
      <div className="bg-white">
        <div className="container-page py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map(({ icon: Icon, label, value, color, action }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <div className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#AAAAAA]">{label}</p>
                    {action ? (
                      <a href={action} className="mt-1 block text-sm font-medium text-[#111111] transition-colors hover:text-[#525252]">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-[#111111]">{value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── WhatsApp CTA band ─────────────────────────────── */}
      <div className="border-t border-[#E5E5E5] bg-[#F8F8F8]">
        <div className="container-page py-14">
          <Reveal>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E5] bg-white">
                <MessageCircle size={24} className="text-[#25D366]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">
                The fastest way to reach us
              </h2>
              <p className="max-w-md text-sm text-[#666666]">
                Skip the form. Drop us a message on WhatsApp and our team responds quickly — usually within the hour.
              </p>
              <WhatsAppButton
                href={whatsappUrl}
                label="Open WhatsApp Chat"
                sourcePage="contact-bottom"
              />
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  )
}