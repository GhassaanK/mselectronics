import type { MetadataRoute } from "next"
import { brandConfig } from "@/config/brand"
import { getProducts } from "@/lib/firebase/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const staticRoutes = ["", "/shop", "/brands", "/categories", "/about", "/contact", "/cart"]
  return [
    ...staticRoutes.map((route) => ({ url: `${brandConfig.siteUrl}${route}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${brandConfig.siteUrl}/shop/${product.id}`, lastModified: new Date() }))
  ]
}
