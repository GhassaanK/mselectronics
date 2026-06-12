"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductGrid } from "@/components/shop/ProductGrid"
import type { Brand, Category, ProductAvailability, SerializableProduct } from "@/types"

export function ShopFilters({ products, categories, brands }: { products: SerializableProduct[]; categories: Category[]; brands: Brand[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const search = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const brand = searchParams.get("brand") || ""
  const availability = (searchParams.get("availability") || "") as ProductAvailability | ""
  const maxPrice = searchParams.get("maxPrice") || ""

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false })
  }

  const filtered = useMemo(() => products.filter((product) => {
    const matchesSearch = [product.name, product.brand, product.category].join(" ").toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? product.category === categories.find((item) => item.slug === category)?.name : true
    const matchesBrand = brand ? product.brand === brands.find((item) => item.slug === brand)?.name : true
    const matchesAvailability = availability ? product.availability === availability : true
    const matchesPrice = maxPrice ? product.price <= Number(maxPrice) : true
    return matchesSearch && matchesCategory && matchesBrand && matchesAvailability && matchesPrice
  }).slice(0, 12), [products, search, category, brand, availability, maxPrice, categories, brands])

  const filterPanel = (
    <div className="grid gap-md">
      <FilterSelect label="Category" value={category} onChange={(value) => setFilter("category", value)} options={categories.map((item) => ({ label: item.name, value: item.slug }))} />
      <FilterSelect label="Brand" value={brand} onChange={(value) => setFilter("brand", value)} options={brands.map((item) => ({ label: item.name, value: item.slug }))} />
      <FilterSelect label="Availability" value={availability} onChange={(value) => setFilter("availability", value)} options={["In Stock", "On Order", "Out of Stock"].map((item) => ({ label: item, value: item }))} />
      <label className="grid gap-sm text-sm font-semibold">
        Max price
        <Input inputMode="numeric" value={maxPrice} onChange={(event) => setFilter("maxPrice", event.target.value)} placeholder="PKR" />
      </label>
      <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
    </div>
  )

  return (
    <div className="grid gap-xl lg:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-lg bg-white/80 dark:bg-zinc-900/80 border p-lg lg:block">{filterPanel}</aside>
      <div className="grid gap-lg">
        <div className="flex gap-sm">
          <div className="relative flex-1">
            <Search className="absolute left-md top-1/2 -translate-y-1/2 text-muted" size={18} />
            <Input className="pl-10" value={search} onChange={(event) => setFilter("q", event.target.value)} placeholder="Search appliances, brands, categories" />
          </div>
          <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Filters"><SlidersHorizontal size={18} /></Button>
            </DialogTrigger>
            <DialogContent className="lg:hidden">
              <DialogHeader><DialogTitle>Filters</DialogTitle></DialogHeader>
              {filterPanel}
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{filtered.length} products shown</span>
          <span>12 per page</span>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }) {
  return (
    <label className="grid gap-sm text-sm font-semibold">
      {label}
      <select className="h-11 rounded-md border bg-background px-md text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
