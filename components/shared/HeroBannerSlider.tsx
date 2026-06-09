"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner } from "@/lib/firebase/banners"

// ── Placeholder banners used when no banners in DB ────────────────────────────
export const PLACEHOLDER_BANNERS: Omit<Banner, "id">[] = [
  {
    imageUrl: "",           // empty = show gradient placeholder
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
    subheadline: "The latest models from top brands — explore what's just landed.",
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
    }, 350)
  }, [transitioning])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length])

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setTimeout(next, 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next, slides.length])

  const slide = slides[current]

  return (
    <section
      className="relative h-[90vh] min-h-[560px] max-h-[820px] overflow-hidden"
      aria-label="Hero banner"
    >
      {/* ── Background ──────────────────────────────────── */}
      <div
        className={[
          "absolute inset-0 transition-opacity duration-700",
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
          /* Gradient placeholder */
          <div className="absolute inset-0 bg-[rgb(var(--navy))]">
            {/* Decorative glows */}
            <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--blue)/0.18)] blur-[120px]" />
            <div className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-[rgb(var(--accent)/0.10)] blur-[100px]" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgb(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>
        )}

        {/* Overlay gradient — always, ensures text legibility over images */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--navy)/0.85)] via-[rgb(var(--navy)/0.45)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--navy)/0.60)] via-transparent to-transparent" />
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="container-page relative z-10 flex h-full flex-col justify-center">
        <div
          className={[
            "max-w-2xl transition-all duration-500",
            transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
          ].join(" ")}
        >
          {/* Eyebrow */}
          <div className="eyebrow mb-4">
            <span className="h-px w-6 bg-[rgb(var(--blue))]" />
            MS Electronics
          </div>

          {/* Headline */}
          {slide.headline && (
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {slide.headline}
            </h1>
          )}

          {/* Subheadline */}
          {slide.subheadline && (
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              {slide.subheadline}
            </p>
          )}

          {/* CTA */}
          {slide.ctaLabel && slide.ctaHref && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={slide.ctaHref} className="btn-primary">
                {slide.ctaLabel}
              </Link>
              <Link href="/contact" className="btn-ghost border-white/20 text-white hover:border-white/40 hover:bg-white/10 hover:text-white">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Arrows (only if multiple slides) ────────────── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70",
                ].join(" ")}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Slide counter (bottom right) ─────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 z-20 font-display text-xs font-semibold text-white/40 tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      )}
    </section>
  )
}
