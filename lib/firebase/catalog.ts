import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import {
  sampleBrands,
  sampleCategories,
  sampleSettings,
  sampleTestimonials,
} from "@/lib/firebase/sample-data"
import type {
  Brand,
  Category,
  SiteSettings,
  Testimonial,
} from "@/types"

function canUseFirestore() {
  return firebaseEnabled && Boolean(db)
}

export async function getCategories(): Promise<Category[]> {
  if (!canUseFirestore()) return sampleCategories

  const snapshot = await getDocs(
    query(
      collection(db!, "categories"),
      orderBy("productCount", "desc")
    )
  )

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Category, "id">),
  }))
}

export async function getBrands(): Promise<Brand[]> {
  if (!canUseFirestore()) return sampleBrands

  const snapshot = await getDocs(
    query(
      collection(db!, "brands"),
      orderBy("displayOrder")
    )
  )

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Brand, "id">),
  }))
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!canUseFirestore()) return sampleTestimonials

  const snapshot = await getDocs(
    query(
      collection(db!, "testimonials"),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Testimonial, "id">),
  }))
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!canUseFirestore()) return sampleSettings

  const snapshot = await getDoc(
    doc(db!, "settings", "site")
  )

  return snapshot.exists()
    ? (snapshot.data() as SiteSettings)
    : sampleSettings
}