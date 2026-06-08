export const brandConfig = {
  companyName: "MS Electronics",
  companyDescription: "Premium appliances, trusted guidance, and WhatsApp-first inquiries for homes across Pakistan.",
  logo: "/logo.svg",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://mselectronics.pk",
  socialLinks: {
    facebook: "https://facebook.com/mselectronics",
    instagram: "https://instagram.com/mselectronics",
    tiktok: "https://tiktok.com/@mselectronics"
  },
  contactInfo: {
    address: "Main Electronics Market, Pakistan",
    phone: "+92 300 1234567",
    email: "info@mselectronics.pk"
  },
  brandColors: {
    primaryFrom: "#1a1aff",
    primaryTo: "#3b5bff",
    accent: "#ff3a00",
    background: "#ffffff",
    surface: "#f8f9fc",
    textPrimary: "#0a0a1a",
    textMuted: "#6b7280",
    border: "#e5e7eb"
  }
} as const

export type BrandConfig = typeof brandConfig
