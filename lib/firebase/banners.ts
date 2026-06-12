import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"

export type Banner = {
  id: string
  imageUrl: string        // full URL or Cloudinary public ID
  imagePublicId?: string  // Cloudinary public ID if using Cloudinary
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  order: number
  active: boolean
}

export type BannerInput = Omit<Banner, "id">

function canUse() {
  return firebaseEnabled && Boolean(db)
}

export async function getBanners(): Promise<Banner[]> {
  if (!canUse()) return []

  const snap = await getDocs(
    query(
      collection(db!, "banners"),
      orderBy("order", "asc")
    )
  )

  return snap.docs.map((d) => {
    const data = d.data()

    return {
      id: d.id,
      imageUrl: data.imageUrl ?? "",
      imagePublicId: data.imagePublicId,
      headline: data.headline,
      subheadline: data.subheadline,
      ctaLabel: data.ctaLabel,
      ctaHref: data.ctaHref,
      order: data.order ?? 0,
      active: data.active ?? true,
    }
  })
}

export async function createBanner(input: BannerInput) {
  if (!canUse()) throw new Error("Firebase is not configured.")
  return addDoc(collection(db!, "banners"), { ...input, createdAt: serverTimestamp() })
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  if (!canUse()) throw new Error("Firebase is not configured.")
  return updateDoc(doc(db!, "banners", id), { ...input, updatedAt: serverTimestamp() })
}

export async function deleteBanner(id: string) {
  if (!canUse()) throw new Error("Firebase is not configured.")
  return deleteDoc(doc(db!, "banners", id))
}
