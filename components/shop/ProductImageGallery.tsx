"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CldImage } from "next-cloudinary"

type ProductImage = {
  publicId: string
  alt?: string
}

type Props = {
  images: ProductImage[]
  productName: string
}

export function ProductImageGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Reset to first image whenever the images array changes (e.g. color variant switch)
  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  const fallback: ProductImage = {
    publicId: "samples/ecommerce/analog-classic",
    alt: productName,
  }

  const list = images.length > 0 ? images : [fallback]
  const active = list[activeIndex]

  function prev() {
    setActiveIndex((i) => (i === 0 ? list.length - 1 : i - 1))
  }

  function next() {
    setActiveIndex((i) => (i === list.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
        <div className="relative aspect-square">
          <CldImage
            key={active.publicId}
            src={active.publicId}
            alt={active.alt || productName}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain transition-opacity duration-200"
          />
        </div>

        {/* Prev / Next arrows — only shown when there are multiple images */}
        {list.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#E5E5E5] bg-white p-1.5 shadow-sm transition hover:bg-[#F2F2F2]"
            >
              <ChevronLeft size={16} className="text-[#525252]" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#E5E5E5] bg-white p-1.5 shadow-sm transition hover:bg-[#F2F2F2]"
            >
              <ChevronRight size={16} className="text-[#525252]" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={[
                    "h-1.5 rounded-full transition-all duration-200",
                    i === activeIndex
                      ? "w-4 bg-[#111111]"
                      : "w-1.5 bg-[#CCCCCC] hover:bg-[#AAAAAA]",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip — only rendered for 2+ images ── */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={[
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[#F8F8F8] transition-all duration-150",
                i === activeIndex
                  ? "border-[#111111] shadow-sm"
                  : "border-transparent hover:border-[#CCCCCC]",
              ].join(" ")}
            >
              <CldImage
                src={img.publicId}
                alt={img.alt || `${productName} image ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}