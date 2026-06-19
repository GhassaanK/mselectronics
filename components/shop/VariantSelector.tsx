"use client"

import type { ColorVariant, SizeVariant } from "@/types"

type Props = {
  colorVariants: ColorVariant[]
  sizeVariants: SizeVariant[]
  activeColorId: string | null
  activeSizeId: string | null
  onColorChange: (variant: ColorVariant | null) => void
  onSizeChange: (variant: SizeVariant | null) => void
}

export function VariantSelector({
  colorVariants,
  sizeVariants,
  activeColorId,
  activeSizeId,
  onColorChange,
  onSizeChange,
}: Props) {
  if (colorVariants.length === 0 && sizeVariants.length === 0) return null

  return (
    <div className="grid gap-4">
      {/* Color swatches */}
      {colorVariants.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
            Color
            {activeColorId && (
              <span className="ml-2 font-normal normal-case text-[#111111]">
                — {colorVariants.find((v) => v.id === activeColorId)?.label}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => {
              const isActive = variant.id === activeColorId
              return (
                <button
                  key={variant.id}
                  type="button"
                  title={variant.label}
                  aria-label={`Select color: ${variant.label}`}
                  aria-pressed={isActive}
                  onClick={() => onColorChange(isActive ? null : variant)}
                  className={[
                    "relative h-7 w-7 rounded-full border-2 transition-all duration-150",
                    isActive
                      ? "border-[#111111] scale-110 shadow-md"
                      : "border-transparent hover:border-[#AAAAAA] hover:scale-105",
                  ].join(" ")}
                  style={{ backgroundColor: variant.hex }}
                >
                  {/* White outline ring so light colors are visible against white bg */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[#E5E5E5]"
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size / capacity buttons */}
      {sizeVariants.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
            Size / Capacity
          </p>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => {
              const isActive = variant.id === activeSizeId
              const unavailable = variant.availability === "Out of Stock"
              return (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Select size: ${variant.label}${unavailable ? " (out of stock)" : ""}`}
                  disabled={unavailable}
                  onClick={() => onSizeChange(isActive ? null : variant)}
                  className={[
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "border-[#111111] bg-[#111111] text-white shadow-sm"
                      : unavailable
                        ? "cursor-not-allowed border-[#E5E5E5] bg-[#F8F8F8] text-[#CCCCCC] line-through"
                        : "border-[#E5E5E5] bg-white text-[#111111] hover:border-[#111111]",
                  ].join(" ")}
                >
                  {variant.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}