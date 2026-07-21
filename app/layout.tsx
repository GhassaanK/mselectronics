import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { AnnouncementBar } from "@/components/layout/AnnouncementBar"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { CartProvider } from "@/lib/context/CartContext"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { brandConfig } from "@/config/brand"
import { defaultTheme } from "@/lib/firebase/theme"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.siteUrl),

  title: {
    default: "MS Electronics | Premium Home Appliances",
    template: "%s | MS Electronics",
  },

  description: brandConfig.companyDescription,

  keywords: [
    "MS Electronics",
    "Air Conditioners",
    "Refrigerators",
    "LED TVs",
    "Washing Machines",
    "Kitchen Appliances",
    "Electronics Karachi",
    "Home Appliances Pakistan",
  ],

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

  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",

    name: brandConfig.companyName,
    url: brandConfig.siteUrl,

    logo: `${brandConfig.siteUrl}${brandConfig.logo}`,

    telephone: brandConfig.contactInfo.phone,

    address: {
      "@type": "PostalAddress",
      streetAddress: brandConfig.contactInfo.address,
    },

    sameAs: [
      brandConfig.socialLinks.facebook,
      brandConfig.socialLinks.instagram,
    ].filter(Boolean),
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-white font-sans antialiased`}
      >
        <ThemeProvider theme={defaultTheme} />

        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd),
          }}
        />

        <CartProvider>
          <div className="flex min-h-screen flex-col">

            <div className="public-chrome">
              <AnnouncementBar />
            </div>

            <div className="public-chrome">
              <Navbar />
            </div>

            <main className="flex-1">
              {children}
            </main>

            <div className="public-chrome">
              <Footer />
            </div>

          </div>
        </CartProvider>
      </body>
    </html>
  )
}
