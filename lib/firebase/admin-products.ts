"use client"

import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import type { ProductAvailability, ProductBadge, ProductImage } from "@/types"

export type AdminProductInput = {
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  images: ProductImage[]
  specs: Record<string, string>
  features: string[]
  availability: ProductAvailability
  featured: boolean
  badge?: ProductBadge
}

export async function createProduct(input: AdminProductInput) {
  if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.")
  return addDoc(collection(db, "products"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateProduct(id: string, input: AdminProductInput) {
  if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.")
  return setDoc(doc(db, "products", id), {
    ...input,
    updatedAt: serverTimestamp()
  }, { merge: true })
}

export async function deleteProduct(id: string) {
  if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.")
  return deleteDoc(doc(db, "products", id))
}
