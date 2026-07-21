import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import { sampleProducts } from "@/lib/firebase/sample-data"
import type { Product } from "@/types"

function canUseFirestore() {
  return firebaseEnabled && Boolean(db)
}

function serializeProduct(id: string, data: unknown): Product {
  return {
    id,
    ...(data as Omit<Product, "id">),
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!canUseFirestore()) {
    return sampleProducts
  }

  const snapshot = await getDocs(
    query(
      collection(db!, "products"),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map((item) =>
    serializeProduct(item.id, item.data())
  )
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  if (!canUseFirestore()) {
    return sampleProducts.find(
      (product) => product.id === id
    ) ?? null
  }

  const snapshot = await getDoc(
    doc(db!, "products", id)
  )

  if (!snapshot.exists()) {
    return null
  }

  return serializeProduct(
    snapshot.id,
    snapshot.data()
  )
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  if (!canUseFirestore()) {
    return sampleProducts.filter(
      (product) =>
        product.category === category &&
        product.availability !== "Out of Stock"
    )
  }

  const snapshot = await getDocs(
    query(
      collection(db!, "products"),
      where("category", "==", category)
    )
  )

  return snapshot.docs.map((item) =>
    serializeProduct(item.id, item.data())
  ).filter((product) => product.availability !== "Out of Stock")
}

export async function getProductsByBrand(
  brand: string
): Promise<Product[]> {
  if (!canUseFirestore()) {
    return sampleProducts.filter(
      (product) =>
        product.brand === brand &&
        product.availability !== "Out of Stock"
    )
  }

  const snapshot = await getDocs(
    query(
      collection(db!, "products"),
      where("brand", "==", brand)
    )
  )

  return snapshot.docs.map((item) =>
    serializeProduct(item.id, item.data())
  ).filter((product) => product.availability !== "Out of Stock")
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!canUseFirestore()) {
    return sampleProducts.filter(
      (product) => product.featured
    )
  }

  const snapshot = await getDocs(
    query(
      collection(db!, "products"),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(8)
    )
  )

  return snapshot.docs.map((item) =>
    serializeProduct(item.id, item.data())
  )
}

export async function getBestSellers(): Promise<Product[]> {
  if (!canUseFirestore()) {
    return sampleProducts.filter(
      (product) =>
        product.badge === "Best Seller" ||
        product.featured
    )
  }

  const snapshot = await getDocs(
    query(
      collection(db!, "products"),
      where("badge", "==", "Best Seller"),
      orderBy("createdAt", "desc"),
      limit(8)
    )
  )

  return snapshot.docs.map((item) =>
    serializeProduct(item.id, item.data())
  )
}
