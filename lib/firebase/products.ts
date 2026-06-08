import { unstable_cache } from "next/cache"
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleProducts } from "@/lib/firebase/sample-data"
import type { Product } from "@/types"

function canUseFirestore() {
  return firebaseEnabled && Boolean(db)
}

function serializeProduct(id: string, data: unknown): Product {
  return { id, ...(data as Omit<Product, "id">) }
}

async function fetchProducts() {
  if (!canUseFirestore()) return sampleProducts
  const snapshot = await getDocs(query(collection(db!, "products"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((item) => serializeProduct(item.id, item.data()))
}

export const getProducts = unstable_cache(fetchProducts, ["products"], { revalidate: 3600 })

export async function getProductById(id: string) {
  if (!canUseFirestore()) return sampleProducts.find((product) => product.id === id) || null
  const snapshot = await getDoc(doc(db!, "products", id))
  return snapshot.exists() ? serializeProduct(snapshot.id, snapshot.data()) : null
}

export async function getProductsByCategory(category: string) {
  if (!canUseFirestore()) return sampleProducts.filter((product) => product.category === category && product.availability !== "Out of Stock")
  const snapshot = await getDocs(query(collection(db!, "products"), where("category", "==", category), where("availability", "!=", "Out of Stock")))
  return snapshot.docs.map((item) => serializeProduct(item.id, item.data()))
}

export async function getProductsByBrand(brand: string) {
  if (!canUseFirestore()) return sampleProducts.filter((product) => product.brand === brand && product.availability !== "Out of Stock")
  const snapshot = await getDocs(query(collection(db!, "products"), where("brand", "==", brand), where("availability", "!=", "Out of Stock")))
  return snapshot.docs.map((item) => serializeProduct(item.id, item.data()))
}

export async function getFeaturedProducts() {
  if (!canUseFirestore()) return sampleProducts.filter((product) => product.featured)
  const snapshot = await getDocs(query(collection(db!, "products"), where("featured", "==", true), orderBy("createdAt", "desc"), limit(8)))
  return snapshot.docs.map((item) => serializeProduct(item.id, item.data()))
}

export async function getBestSellers() {
  if (!canUseFirestore()) return sampleProducts.filter((product) => product.badge === "Best Seller" || product.featured)
  const snapshot = await getDocs(query(collection(db!, "products"), where("badge", "==", "Best Seller"), orderBy("createdAt", "desc"), limit(8)))
  return snapshot.docs.map((item) => serializeProduct(item.id, item.data()))
}
