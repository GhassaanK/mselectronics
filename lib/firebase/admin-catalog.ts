import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import type { Brand, Category } from "@/types"

function canUse() {
  return firebaseEnabled && Boolean(db)
}

/* ──────────────────────────────────────────────
   BRANDS
────────────────────────────────────────────── */

export type BrandInput = Omit<Brand, "id">

export async function createBrand(input: BrandInput) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return addDoc(collection(db!, "brands"), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function updateBrand(
  id: string,
  input: Partial<BrandInput>
) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return setDoc(
    doc(db!, "brands", id),
    {
      ...input,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteBrand(id: string) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return deleteDoc(doc(db!, "brands", id))
}

/* ──────────────────────────────────────────────
   CATEGORIES
────────────────────────────────────────────── */

export type CategoryInput = Omit<Category, "id">

export async function createCategory(input: CategoryInput) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return addDoc(collection(db!, "categories"), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return setDoc(
    doc(db!, "categories", id),
    {
      ...input,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteCategory(id: string) {
  if (!canUse()) throw new Error("Firebase is not configured.")

  return deleteDoc(doc(db!, "categories", id))
}