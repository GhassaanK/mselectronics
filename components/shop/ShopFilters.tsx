"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ProductGrid } from "@/components/shop/ProductGrid"
import type { Brand, Category, ProductAvailability, SerializableProduct } from "@/types"

const PAGE_SIZE = 12

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current])
  if (current > 1) pages.add(current - 1)
  if (current < total) pages.add(current + 1)

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: (number | "...")[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...")
    result.push(sorted[i])
  }

  return result
}

export function ShopFilters({
  products,
  categories,
  brands,
}: {
  products: SerializableProduct[]
  categories: Category[]
  brands: Brand[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
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
    setPage(1)
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function clearFilters() {
    setPage(1)
    router.replace(pathname, { scroll: false })
  }

  const filtered = useMemo(() => products.filter((product) => {
    const matchesSearch = [product.name, product.brand, product.category].join(" ").toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? product.category === categories.find((item) => item.slug === category)?.name : true
    const matchesBrand = brand ? product.brand === brands.find((item) => item.slug === brand)?.name : true
    const matchesAvailability = availability ? product.availability === availability : true
    const matchesPrice = maxPrice ? product.price <= Number(maxPrice) : true
    return matchesSearch && matchesCategory && matchesBrand && matchesAvailability && matchesPrice
  }), [products, search, category, brand, availability, maxPrice, categories, brands])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageRange = getPageRange(page, totalPages)

  const filterPanel = (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-bold text-[#0A0F1E]">Refine products</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Use filters together to narrow the catalog quickly.
        </p>
      </div>
      <FilterSelect label="Category" value={category} onChange={(value) => setFilter("category", value)} options={categories.map((item) => ({ label: item.name, value: item.slug }))} />
      <FilterSelect label="Brand" value={brand} onChange={(value) => setFilter("brand", value)} options={brands.map((item) => ({ label: item.name, value: item.slug }))} />
      <FilterSelect label="Availability" value={availability} onChange={(value) => setFilter("availability", value)} options={["In Stock", "On Order", "Out of Stock"].map((item) => ({ label: item, value: item }))} />
      <label className="grid gap-2 text-sm font-semibold text-[#0A0F1E]">
        Max price
        <Input className="h-11 bg-white" inputMode="numeric" value={maxPrice} onChange={(event) => setFilter("maxPrice", event.target.value)} placeholder="PKR" />
      </label>
      <Button variant="outline" className="h-11 justify-center" onClick={clearFilters}>Clear filters</Button>
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <aside className="hidden self-start rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_28px_rgb(15,23,42,0.06)] lg:sticky lg:top-24 lg:block">
        {filterPanel}
      </aside>

      <div className="grid min-w-0 gap-5">
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-[0_10px_28px_rgb(15,23,42,0.05)]">
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                className="h-11 border-[#E5E7EB] bg-[#F8FAFC] pl-10 focus:bg-white"
                value={search}
                onChange={(event) => setFilter("q", event.target.value)}
                placeholder="Search appliances, brands, categories"
              />
            </div>
            <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 lg:hidden" aria-label="Filters">
                  <SlidersHorizontal size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:hidden">
                <DialogHeader><DialogTitle>Filters</DialogTitle></DialogHeader>
                {filterPanel}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>{filtered.length} products found</span>
          {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
        </div>

        <ProductGrid products={paginated} />

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Button>

            {pageRange.map((entry, index) =>
              entry === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 select-none items-center justify-center text-sm text-[#AAAAAA]"
                  aria-hidden
                >
                  ...
                </span>
              ) : (
                <Button
                  key={entry}
                  variant={entry === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(entry)}
                  aria-label={`Page ${entry}`}
                  aria-current={entry === page ? "page" : undefined}
                >
                  {entry}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0A0F1E]">
      {label}
      <select
        className="h-11 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
