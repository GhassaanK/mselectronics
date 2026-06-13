export const brandConfig = {
  companyName: "MS Electronics",
  companyDescription: "Premium appliances, trusted guidance, and WhatsApp-first inquiries for homes across Pakistan.",
  logo: "/logo.png",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923116771224",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://mselectroplace.com",
  socialLinks: {
    facebook: "https://facebook.com/mselectroplace",
    instagram: "https://instagram.com/mselectroplace",
    tiktok: "#"
  },
  contactInfo: {
    address: "Shop 01, Next to Bank Alfalah, Main Chorangi, Landhi 06, Karachi",
    phone: "+92 311 6771224",
    email: "info@mselectroplace.com"
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
