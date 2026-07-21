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
import { auth, db, firebaseEnabled } from "@/lib/firebase/config"
import type { Brand, Category } from "@/types"

function canUse() {
  return firebaseEnabled && Boolean(db)
}

async function requireAdminUser() {
  if (!auth?.currentUser) {
    throw new Error("You must be signed in to manage catalog data.")
  }

  await auth.currentUser.getIdToken(true)
}

async function ensureUniqueBrand(input: Partial<BrandInput>, currentId?: string) {
  for (const field of ["name", "slug"] as const) {
    const value = input[field]?.trim()
    if (!value) continue

    const snap = await getDocs(query(collection(db!, "brands"), where(field, "==", value)))
    const conflict = snap.docs.some((item) => item.id !== currentId)
    if (conflict) {
      throw new Error(`Another brand already uses this ${field}.`)
    }
  }
}

async function ensureUniqueCategory(input: Partial<CategoryInput>, currentId?: string) {
  for (const field of ["name", "slug"] as const) {
    const value = input[field]?.trim()
    if (!value) continue

    const snap = await getDocs(query(collection(db!, "categories"), where(field, "==", value)))
    const conflict = snap.docs.some((item) => item.id !== currentId)
    if (conflict) {
      throw new Error(`Another category already uses this ${field}.`)
    }
  }
}

/* ──────────────────────────────────────────────
   BRANDS
────────────────────────────────────────────── */

export type BrandInput = Omit<Brand, "id">

export async function createBrand(input: BrandInput) {
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")
  await ensureUniqueBrand(input)

  return addDoc(collection(db!, "brands"), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function updateBrand(
  id: string,
  input: Partial<BrandInput>
) {
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")
  await ensureUniqueBrand(input, id)

  if (input.name) {
    const existing = await getDoc(doc(db!, "brands", id))
    const previousName = existing.exists() ? existing.data().name as string | undefined : undefined

    if (previousName && previousName !== input.name) {
      const productsSnap = await getDocs(query(collection(db!, "products"), where("brand", "==", previousName)))
      if (!productsSnap.empty) {
        throw new Error("This brand is used by products. Reassign those products before renaming it.")
      }
    }
  }

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
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")

  const brandDoc = await getDoc(doc(db!, "brands", id))
  const brandName = brandDoc.exists() ? brandDoc.data().name as string | undefined : undefined

  if (brandName) {
    const productsSnap = await getDocs(query(collection(db!, "products"), where("brand", "==", brandName)))
    if (!productsSnap.empty) {
      throw new Error("This brand is still used by products. Reassign or delete those products first.")
    }
  }

  return deleteDoc(doc(db!, "brands", id))
}

/* ──────────────────────────────────────────────
   CATEGORIES
────────────────────────────────────────────── */

export type CategoryInput = Omit<Category, "id">

export async function createCategory(input: CategoryInput) {
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")
  await ensureUniqueCategory(input)

  return addDoc(collection(db!, "categories"), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
) {
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")
  await ensureUniqueCategory(input, id)

  if (input.name) {
    const existing = await getDoc(doc(db!, "categories", id))
    const previousName = existing.exists() ? existing.data().name as string | undefined : undefined

    if (previousName && previousName !== input.name) {
      const productsSnap = await getDocs(query(collection(db!, "products"), where("category", "==", previousName)))
      if (!productsSnap.empty) {
        throw new Error("This category is used by products. Reassign those products before renaming it.")
      }
    }
  }

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
  await requireAdminUser()

  if (!canUse()) throw new Error("Firebase is not configured.")

  const categoryDoc = await getDoc(doc(db!, "categories", id))
  const categoryName = categoryDoc.exists() ? categoryDoc.data().name as string | undefined : undefined

  if (categoryName) {
    const productsSnap = await getDocs(query(collection(db!, "products"), where("category", "==", categoryName)))
    if (!productsSnap.empty) {
      throw new Error("This category is still used by products. Reassign or delete those products first.")
    }
  }

  return deleteDoc(doc(db!, "categories", id))
}
