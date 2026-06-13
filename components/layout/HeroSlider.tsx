"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goNext = () => {
    setCurrent((c) => (c + 1) % slides.length)
  }

  useEffect(() => {
    if (paused || slides.length < 2) return
    intervalRef.current = setInterval(goNext, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, slides.length, current])

  const slide = slides[current]

  return (
    <div
      className="relative h-[92vw] min-h-[560px] max-h-[820px] w-full overflow-hidden bg-[#0A0F1E]"
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

        {/* Stronger gradient so text reads clearly */}
        {(slide.imagePublicId || slide.imageUrl) && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B18]/95 via-[#060B18]/65 to-[#060B18]/15" />
        )}
      </div>

      {/* Copy */}
      {(slide.headline || slide.subheadline || slide.ctaLabel) && (
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div key={`copy-${current}`} className="max-w-xl space-y-5 animate-slide-up">

              {/* Eyebrow */}
              <p className="text-[11px] font-medium tracking-[0.28em] text-blue-400 uppercase">
                MS Electronics · Karachi
              </p>

              {/* Headline */}
              {slide.headline && (
                <h2 className="text-[2.6rem] font-bold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                  {slide.headline}
                </h2>
              )}

              {/* Subheadline */}
              {slide.subheadline && (
                <p className="max-w-sm text-[0.9rem] leading-relaxed text-white/80 md:text-[0.95rem]">
                  {slide.subheadline}
                </p>
              )}

              {/* CTAs */}
              {slide.ctaLabel && slide.ctaHref && (
                <div className="flex items-center gap-5 pt-1">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-[#0A0F1E] transition-all duration-200 hover:bg-white/90 active:scale-[0.98]"
                  >
                    {slide.ctaLabel}
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-white/60 underline-offset-4 transition-colors duration-200 hover:text-white/90 hover:underline"
                  >
                    Talk to us
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dots — bottom right */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                "rounded-full transition-all duration-300",
                i === current
                  ? "h-1.5 w-5 bg-white"
                  : "h-1.5 w-1.5 bg-white/25 hover:bg-white/45",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  )
}