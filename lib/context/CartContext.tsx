"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { CartItem } from "@/types"

type CartContextValue = {
  items: CartItem[]
  count: number
  addItem: (item: string | Omit<CartItem, "quantity">) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const storageKey = "ms-electronics-inquiry-cart"
export const cartStorageKey = storageKey

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return

      setItems(
        parsed
          .filter((item): item is CartItem =>
            item &&
            typeof item.id === "string" &&
            typeof item.quantity === "number"
          )
          .map((item) => ({
            ...item,
            quantity: Math.max(1, Math.min(10, Math.floor(item.quantity))),
          }))
      )
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (input) => setItems((current) => {
      const nextItem = typeof input === "string" ? { id: input } : input
      const id = nextItem.id
      const existing = current.find((item) => item.id === id)
      return existing
        ? current.map((item) => item.id === id ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item)
        : [...current, { ...nextItem, quantity: 1 }]
    }),
    updateQuantity: (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([])
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside CartProvider")
  return context
}
