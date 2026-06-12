"use client"

import { useEffect, useState, type FormEvent } from "react"
import type { User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { onAuthStateChange, signInWithEmail, signOut } from "@/lib/firebase/auth"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => onAuthStateChange(setUser), [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      // Normalize Firebase error codes into friendly messages
      const code = (err as { code?: string }).code ?? ""
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Incorrect email or password.")
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later or reset your password.")
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else {
        setError("Sign in failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Still checking auth state
  if (user === undefined) {
    return <div className="container-page py-2xl text-muted text-sm">Checking access...</div>
  }

  // Not signed in — show login form
  if (!user) {
    return (
      <section className="container-page py-3xl">
        <Card className="mx-auto max-w-sm p-xl">
          <h1 className="heading-tight text-2xl">Admin login</h1>
          <p className="mt-xs text-sm text-muted">MS Electronics dashboard</p>

          <form className="mt-lg grid gap-md" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="rounded-md bg-red-500/10 px-md py-sm text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </section>
    )
  }

  // Signed in — render protected content with a sign-out option
  return (
    <>
      {children}
      {/* Sign out is handled inside AdminShell's sidebar — 
          but this is a fallback in case AdminShell isn't wrapping */}
    </>
  )
}

// Convenience export so AdminShell sidebar can call this
export { signOut }