import { unstable_cache } from "next/cache"
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleBrands, sampleCategories, sampleSettings, sampleTestimonials } from "@/lib/firebase/sample-data"
import type { Brand, Category, SiteSettings, Testimonial } from "@/types"

function canUseFirestore() {
  return firebaseEnabled && Boolean(db)
}

export const getCategories = unstable_cache(async (): Promise<Category[]> => {
  if (!canUseFirestore()) return sampleCategories
  const snapshot = await getDocs(query(collection(db!, "categories"), orderBy("productCount", "desc")))
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Category, "id">) }))
}, ["categories"], { revalidate: 3600 })

export const getBrands = unstable_cache(async (): Promise<Brand[]> => {
  if (!canUseFirestore()) return sampleBrands
  const snapshot = await getDocs(query(collection(db!, "brands"), orderBy("displayOrder")))
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Brand, "id">) }))
}, ["brands"], { revalidate: 3600 })

export const getTestimonials = unstable_cache(async (): Promise<Testimonial[]> => {
  if (!canUseFirestore()) return sampleTestimonials
  const snapshot = await getDocs(query(collection(db!, "testimonials"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Testimonial, "id">) }))
}, ["testimonials"], { revalidate: 3600 })

export const getSiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  if (!canUseFirestore()) return sampleSettings
  const snapshot = await getDoc(doc(db!, "settings", "site"))
  return snapshot.exists() ? (snapshot.data() as SiteSettings) : sampleSettings
}, ["settings-site"], { revalidate: 3600 })
