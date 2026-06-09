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
  {
    icon: MapPin,
    label: "Visit Us",
    value: brandConfig.contactInfo.address,
    color: "blue",
    action: null,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: brandConfig.contactInfo.phone,
    color: "emerald",
    action: `tel:${brandConfig.contactInfo.phone}`,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: brandConfig.contactInfo.email,
    color: "purple",
    action: `mailto:${brandConfig.contactInfo.email}`,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat, 10 AM – 8 PM",
    color: "orange",
    action: null,
  },
]

const colorMap: Record<string, string> = {
  blue:    "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple:  "bg-purple-50 text-purple-600",
  orange:  "bg-orange-50 text-orange-600",
}

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl([], brandConfig.whatsappNumber)

  return (
    <div>

      {/* ── Page hero ─────────────────────────────────────── */}
      <div className="bg-[#0A0F1E] pb-14 pt-14">
        <div className="container-page max-w-2xl">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-400"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Get in Touch
          </p>
          <h1
            className="text-3xl font-extrabold text-white md:text-5xl"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
          >
            Contact MS Electronics
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/50">
            Questions about availability, warranty, delivery, or installments?
            We&apos;re a WhatsApp message away.
          </p>
          <div className="mt-8">
            <WhatsAppButton
              href={whatsappUrl}
              label="Message us on WhatsApp"
              sourcePage="contact-hero"
            />
          </div>
        </div>
      </div>

      {/* ── Contact cards ─────────────────────────────────── */}
      <div className="bg-[#F7F8FC]">
        <div className="container-page py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map(({ icon: Icon, label, value, color, action }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.06)]">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[color]}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest text-slate-400"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {label}
                    </p>
                    {action ? (
                      <a
                        href={action}
                        className="mt-1.5 block text-sm font-medium text-[#0A0F1E] transition-colors hover:text-blue-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-sm font-medium text-[#0A0F1E]">{value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── WhatsApp CTA band ─────────────────────────────── */}
      <div className="bg-[#0A0F1E]">
        <div className="container-page py-16">
          <Reveal>
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/15">
                <MessageCircle size={28} className="text-[#25D366]" />
              </div>
              <h2
                className="text-2xl font-extrabold text-white md:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                The fastest way to reach us
              </h2>
              <p className="max-w-md text-base text-white/50">
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