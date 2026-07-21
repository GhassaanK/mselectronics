import { addDoc, collection, getDocs, query, serverTimestamp } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"

export async function logInquiry(productIds: string[], sourcePage: string) {
  if (!firebaseEnabled || !db) return
  await addDoc(collection(db, "inquiries"), {
    productIds,
    sourcePage,
    createdAt: serverTimestamp()
  })
}

export async function getInquiryCount() {
  if (!firebaseEnabled || !db) return 0
  if (typeof window === "undefined") return 0

  try {
    const snapshot = await getDocs(query(collection(db, "inquiries")))
    return snapshot.size
  } catch {
    return 0
  }
}
