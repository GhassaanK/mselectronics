"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CldImage } from "next-cloudinary"
import type { Banner } from "@/lib/firebase/banners"

const FALLBACK: Omit<Banner, "id"> = {
  imageUrl: "",
  imagePublicId: "samples/ecommerce/analog-classic",
  headline: "Premium Appliances. Expert Guidance.",
  subheadline: "Official warranty on every product. Delivered across Karachi.",
  ctaLabel: "Browse Products",
  ctaHref: "/shop",
  order: 0,
  active: true,
}

type Props = { banners: Banner[] }

export function HeroSlider({ banners }: Props) {
  const slides = banners.length > 0 ? banners : [{ id: "fallback", ...FALLBACK }]
  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = (dir: "prev" | "next") => {
    setCurrent((c) =>
      dir === "next" ? (c + 1) % slides.length : (c - 1 + slides.length) % slides.length
    )
  }

  useEffect(() => {
    if (paused || slides.length < 2) return
    intervalRef.current = setInterval(() => go("next"), 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, slides.length, current])

  const slide = slides[current]

  return (
    <div
      className="relative h-[92vw] max-h-[680px] min-h-[420px] w-full overflow-hidden bg-[#F0EFED]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide image */}
      <div key={current} className="absolute inset-0 animate-fade-in">
        {slide.imagePublicId ? (
          <CldImage
            src={slide.imagePublicId}
            alt={slide.headline || "Banner"}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover"
          />
        ) : slide.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imageUrl}
            alt={slide.headline || "Banner"}
            className="h-full w-full object-cover"
          />
        ) : null}

        {/* Subtle left vignette only when image is present */}
        {(slide.imagePublicId || slide.imageUrl) && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/15 to-transparent" />
        )}
      </div>

      {/* Copy */}
      {(slide.headline || slide.subheadline || slide.ctaLabel) && (
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div key={`copy-${current}`} className="max-w-lg space-y-4 animate-slide-up">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888888]">
                MS Electronics
              </p>
              {slide.headline && (
                <h2 className="text-3xl font-bold leading-tight text-[#111111] md:text-4xl lg:text-5xl">
                  {slide.headline}
                </h2>
              )}
              <div className="h-px w-8 bg-[#999999]" />
              {slide.subheadline && (
                <p className="text-sm leading-relaxed text-[#666666] md:text-base">
                  {slide.subheadline}
                </p>
              )}
              {slide.ctaLabel && slide.ctaHref && (
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 rounded bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
                >
                  {slide.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go("prev")}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#CCCCCC] bg-white/80 text-[#525252] backdrop-blur-sm transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go("next")}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#CCCCCC] bg-white/80 text-[#525252] backdrop-blur-sm transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                "rounded-full transition-all duration-300",
                i === current ? "h-2 w-6 bg-[#111111]" : "h-2 w-2 bg-[#AAAAAA] hover:bg-[#777777]",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  )
}