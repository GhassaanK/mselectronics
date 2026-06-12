"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner } from "@/lib/firebase/banners"

export const PLACEHOLDER_BANNERS: Omit<Banner, "id">[] = [
  {
    imageUrl: "",
    headline: "Premium Appliances",
    subheadline: "Discover the best in home electronics, delivered to your door in Karachi.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    order: 0,
    active: true,
  },
  {
    imageUrl: "",
    headline: "New Arrivals",
    subheadline: "The latest models from top brands — explore what just landed.",
    ctaLabel: "See New Arrivals",
    ctaHref: "/shop",
    order: 1,
    active: true,
  },
]

type Props = {
  banners: Banner[]
}

export function HeroBannerSlider({ banners }: Props) {
  const activeBanners = banners.filter((b) => b.active)
  const slides = activeBanners.length > 0
    ? activeBanners
    : (PLACEHOLDER_BANNERS as Banner[])

  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((index: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 300)
  }, [transitioning])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setTimeout(next, 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next, slides.length])

  const slide = slides[current]

  return (
    <section
      className="relative overflow-hidden bg-[#F0EFED]"
      style={{ height: "min(88vh, 720px)", minHeight: "460px" }}
      aria-label="Hero banner"
    >
      {/* ── Background image or gradient placeholder ──── */}
      <div
        className={[
          "absolute inset-0 transition-opacity duration-500",
          transitioning ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.headline ?? "Banner"}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          /* Placeholder: clean light gradient */
          <div className="absolute inset-0 bg-gradient-to-br from-[#EEEDED] via-[#E8E7E5] to-[#D8D7D5]" />
        )}
        {/* Very subtle left vignette for text readability only when image present */}
        {slide.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
        )}
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="container-page relative z-10 flex h-full flex-col justify-center">
        <div
          className={[
            "max-w-lg transition-all duration-400",
            transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0",
          ].join(" ")}
        >
          {/* Eyebrow */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#888888]">
            MS Electronics
          </p>

          {/* Headline */}
          {slide.headline && (
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.25rem]">
              {slide.headline}
            </h1>
          )}

          {/* Divider line — matches Super Asia style */}
          <div className="mt-5 h-px w-10 bg-[#999999]" />

          {/* Subheadline */}
          {slide.subheadline && (
            <p className="mt-4 text-sm text-[#666666] sm:text-base">
              {slide.subheadline}
            </p>
          )}

          {/* CTA */}
          {slide.ctaLabel && slide.ctaHref && (
            <div className="mt-7">
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 rounded bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#333333]"
              >
                {slide.ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Arrows ──────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#CCCCCC] bg-white/80 text-[#525252] backdrop-blur-sm transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#CCCCCC] bg-white/80 text-[#525252] backdrop-blur-sm transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-[#111111]"
                    : "w-2 bg-[#AAAAAA] hover:bg-[#777777]",
                ].join(" ")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}