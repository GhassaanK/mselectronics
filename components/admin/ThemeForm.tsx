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
  // Theme editing is disabled — return a read-only notice so admins can't change site colors.
  return (
    <Card className="p-5">
      <h3 className="font-semibold">Theme Locked</h3>
      <p className="mt-2 text-sm text-muted">Site theme is fixed and cannot be changed from the admin panel.</p>
    </Card>
  )
}