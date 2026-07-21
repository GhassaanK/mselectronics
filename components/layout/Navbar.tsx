import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { NavbarClient } from "./NavbarClient"

export const revalidate = 30

export async function Navbar() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  return (
    <NavbarClient
      categories={categories}
      brands={brands}
    />
  )
}
