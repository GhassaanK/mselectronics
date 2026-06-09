"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { updateTheme, defaultTheme, type ThemeColors } from "@/lib/firebase/theme"

/** Convert "R G B" string to #rrggbb hex for the color input */
function rgbToHex(rgb: string): string {
  const parts = rgb.trim().split(/\s+/).map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return "#000000"
  return "#" + parts.map((n) => n.toString(16).padStart(2, "0")).join("")
}

/** Convert #rrggbb hex to "R G B" string */
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}

const COLOR_FIELDS: { key: keyof ThemeColors; label: string; description: string }[] = [
  { key: "navy",      label: "Background / Dark",  description: "Navbar, footer, hero dark background" },
  { key: "blue",      label: "Primary",            description: "Buttons, links, active states" },
  { key: "blueLight", label: "Primary Light",      description: "Hover states, highlights" },
  { key: "accent",    label: "Accent",             description: "Badges, cart counter, alerts" },
]

type Props = {
  initialTheme: ThemeColors
}

export function ThemeForm({ initialTheme }: Props) {
  const [colors, setColors] = useState<ThemeColors>(initialTheme)
  const [status, setStatus] = useState("")

  function setColor(key: keyof ThemeColors, hex: string) {
    setColors((prev) => ({ ...prev, [key]: hexToRgb(hex) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setStatus("Saving...")
      await updateTheme(colors)
      // Apply to current page immediately
      const root = document.documentElement
      root.style.setProperty("--navy",       colors.navy)
      root.style.setProperty("--blue",       colors.blue)
      root.style.setProperty("--blue-light", colors.blueLight)
      root.style.setProperty("--accent",     colors.accent)
      setStatus("Theme saved. Changes are live.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error saving theme.")
    }
  }

  async function handleReset() {
    setColors(defaultTheme)
    try {
      setStatus("Resetting...")
      await updateTheme(defaultTheme)
      const root = document.documentElement
      root.style.setProperty("--navy",       defaultTheme.navy)
      root.style.setProperty("--blue",       defaultTheme.blue)
      root.style.setProperty("--blue-light", defaultTheme.blueLight)
      root.style.setProperty("--accent",     defaultTheme.accent)
      setStatus("Reset to defaults.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error resetting.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        {COLOR_FIELDS.map(({ key, label, description }) => (
          <Card key={key} className="flex items-center gap-4 p-4">
            {/* Color swatch / picker */}
            <label className="relative cursor-pointer">
              <div
                className="h-11 w-11 rounded-lg border border-border shadow-sm transition-transform hover:scale-105"
                style={{ background: `rgb(${colors[key]})` }}
              />
              <input
                type="color"
                value={rgbToHex(colors[key])}
                onChange={(e) => setColor(key, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>

            <div className="min-w-0">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted">{description}</p>
              <p className="mt-0.5 font-mono text-xs text-muted">{rgbToHex(colors[key])}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview strip */}
      <div className="mt-4 overflow-hidden rounded-lg border">
        <div className="flex h-10 items-center justify-between px-4" style={{ background: `rgb(${colors.navy})` }}>
          <span className="text-xs font-semibold text-white/60" style={{ fontFamily: "'Sora', sans-serif" }}>Preview</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: `rgb(${colors.blue})` }}>Button</span>
            <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: `rgb(${colors.accent})` }}>3</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm">Save Theme</Button>
        <Button type="button" size="sm" variant="outline" onClick={handleReset}>Reset to Default</Button>
        {status && <p className="text-xs text-muted">{status}</p>}
      </div>
    </form>
  )
}
