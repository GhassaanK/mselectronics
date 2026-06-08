"use client"

import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { onAuthStateChange, signInWithGoogle } from "@/lib/firebase/auth"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => onAuthStateChange(setUser), [])

  if (user === undefined) return <div className="container-page py-2xl text-muted">Checking admin access...</div>

  if (!user) {
    return (
      <section className="container-page py-3xl">
        <Card className="mx-auto max-w-md p-xl text-center">
          <h1 className="heading-tight text-3xl">Admin login</h1>
          <p className="mt-md text-muted">Sign in with Google to manage MS Electronics.</p>
          <Button className="mt-lg" onClick={() => void signInWithGoogle()}>Continue with Google</Button>
        </Card>
      </section>
    )
  }

  return <>{children}</>
}
