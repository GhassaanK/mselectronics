"use client"

import { Card } from "@/components/ui/card"
import type { ThemeColors } from "@/lib/firebase/theme"

type Props = {
  initialTheme: ThemeColors
}

export function ThemeForm({ initialTheme }: Props) {
  void initialTheme

  return (
    <Card className="p-5">
      <h3 className="font-semibold">Theme Locked</h3>
      <p className="mt-2 text-sm text-muted">Site theme is fixed and cannot be changed from the admin panel.</p>
    </Card>
  )
}
