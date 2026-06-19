"use client"

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import type {
  ColorVariant,
  ProductAvailability,
  ProductBadge,
  ProductImage,
  SizeVariant,
} from "@/types"

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
  colorVariants?: ColorVariant[]
  sizeVariants?: SizeVariant[]
}

async function recalculateCategoryCount(categoryName: string) {
  if (!firebaseEnabled || !db) return

  const productsSnap = await getDocs(
    query(
      collection(db, "products"),
      where("category", "==", categoryName)
    )
  )

  const categoriesSnap = await getDocs(
    query(
      collection(db, "categories"),
      where("name", "==", categoryName)
    )
  )

  if (categoriesSnap.empty) return

  const categoryDoc = categoriesSnap.docs[0]

  await setDoc(
    doc(db, "categories", categoryDoc.id),
    {
      productCount: productsSnap.size,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function createProduct(input: AdminProductInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured.")
  }

  const ref = await addDoc(
    collection(db, "products"),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  )

  await recalculateCategoryCount(input.category)

  return ref
}

export async function updateProduct(
  id: string,
  input: AdminProductInput
) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured.")
  }

  const existing = await getDoc(
    doc(db, "products", id)
  )

  const previousCategory =
    existing.exists()
      ? (existing.data().category as string | undefined)
      : undefined

  await setDoc(
    doc(db, "products", id),
    {
      ...input,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  await recalculateCategoryCount(input.category)

  if (
    previousCategory &&
    previousCategory !== input.category
  ) {
    await recalculateCategoryCount(previousCategory)
  }
}

export async function deleteProduct(id: string) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured.")
  }

  const existing = await getDoc(
    doc(db, "products", id)
  )

  const category =
    existing.exists()
      ? (existing.data().category as string | undefined)
      : undefined

  await deleteDoc(
    doc(db, "products", id)
  )

  if (category) {
    await recalculateCategoryCount(category)
  }
}