"use client"

import {
  addDoc,
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore/lite"
import { auth, db, firebaseEnabled } from "@/lib/firebase/config"
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

async function requireAdminUser() {
  if (!auth?.currentUser) {
    throw new Error("You must be signed in to manage products.")
  }

  await auth.currentUser.getIdToken(true)
}

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep) as T
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, fieldValue]) => fieldValue !== undefined)
        .map(([key, fieldValue]) => [key, stripUndefinedDeep(fieldValue)])
    ) as T
  }

  return value
}

function productCreatePayload(input: AdminProductInput) {
  return {
    ...stripUndefinedDeep(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
}

function productUpdatePayload(input: AdminProductInput) {
  const cleanInput = stripUndefinedDeep(input)

  return {
    ...cleanInput,
    originalPrice: input.originalPrice ?? deleteField(),
    badge: input.badge ?? deleteField(),
    colorVariants: input.colorVariants ?? deleteField(),
    sizeVariants: input.sizeVariants ?? deleteField(),
    updatedAt: serverTimestamp(),
  }
}

export async function createProduct(input: AdminProductInput) {
  await requireAdminUser()

  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured.")
  }

  const ref = await addDoc(
    collection(db, "products"),
    productCreatePayload(input)
  )

  await recalculateCategoryCount(input.category)

  return ref
}

export async function updateProduct(
  id: string,
  input: AdminProductInput
) {
  await requireAdminUser()

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
    productUpdatePayload(input),
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
  await requireAdminUser()

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
