import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { CartProvider } from "@/lib/context/CartContext"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { brandConfig } from "@/config/brand"
import { getTheme } from "@/lib/firebase/theme"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.siteUrl),
  title: {
    default: "MS Electronics | Premium Appliances",
    template: "%s | MS Electronics",
  },
  description: brandConfig.companyDescription,
  openGraph: {
    title: "MS Electronics",
    description: brandConfig.companyDescription,
    url: brandConfig.siteUrl,
    siteName: "MS Electronics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MS Electronics",
    description: brandConfig.companyDescription,
  },
  alternates: { canonical: "/" },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch theme server-side → zero layout shift, no client Firestore call
  const theme = await getTheme()

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandConfig.companyName,
    url: brandConfig.siteUrl,
    logo: `${brandConfig.siteUrl}${brandConfig.logo}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: brandConfig.contactInfo.phone,
      contactType: "sales",
    },
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Inject theme CSS vars before first paint */}
        <ThemeProvider theme={theme} />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}