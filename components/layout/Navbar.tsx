import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { NavbarClient } from "./NavbarClient"

export async function Navbar() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

const revalidate = 30

  return (
    <NavbarClient
      categories={categories}
      brands={brands}
    />
  )
}