"use client"

import { useEffect } from "react"
import type { ThemeColors } from "@/lib/firebase/theme"

/**
 * Drop this inside <html> in layout.tsx.
 * It receives the theme resolved server-side and injects CSS vars,
 * so there's zero client-side Firestore call needed on first load.
 */
export function ThemeProvider({ theme }: { theme: ThemeColors }) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--navy",       theme.navy)
    root.style.setProperty("--blue",       theme.blue)
    root.style.setProperty("--blue-light", theme.blueLight)
    root.style.setProperty("--accent",     theme.accent)
  }, [theme])

  // Also inject inline on first render (SSR-safe via style tag)
  const css = `
    :root {
      --navy: ${theme.navy};
      --blue: ${theme.blue};
      --blue-light: ${theme.blueLight};
      --accent: ${theme.accent};
    }
  `

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
