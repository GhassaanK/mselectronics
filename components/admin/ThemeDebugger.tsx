"use client"

import { useEffect } from "react"

export function ThemeDebugger() {
  useEffect(() => {
    try {
      const root = getComputedStyle(document.documentElement)
      const vars = [
        "--rgb-accent",
        "--accent",
        "--rgb-navy",
        "--rgb-blue",
        "--rgb-blue-light",
        "--surface",
        "--white",
        "--black",
        "--primary",
        "--background",
        "--border",
      ]
      const values: Record<string, string> = {}
      vars.forEach((v) => {
        values[v] = root.getPropertyValue(v).trim() || "(not set)"
      })

      // Also fetch computed backgrounds
      const bodyBg = getComputedStyle(document.body).backgroundColor
      const docBg = getComputedStyle(document.documentElement).backgroundColor

      console.group("ThemeDebugger — CSS variable snapshot")
      console.table(values)
      console.log("documentElement background:", docBg)
      console.log("body background:", bodyBg)

      // If an admin shell element exists, log its computed background too
      const adminEl = document.querySelector(".admin-theme-debug-target") as HTMLElement | null
      if (adminEl) {
        console.log("admin element computed background:", getComputedStyle(adminEl).backgroundColor)
      } else {
        console.log("admin element not found (no .admin-theme-debug-target)")
      }
      console.groupEnd()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("ThemeDebugger error:", e)
    }
  }, [])

  return null
}
