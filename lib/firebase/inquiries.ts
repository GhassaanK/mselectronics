import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db, firebaseEnabled } from "@/lib/firebase/config"

export async function logInquiry(productIds: string[], sourcePage: string) {
  if (!firebaseEnabled || !db) return
  await addDoc(collection(db, "inquiries"), {
    productIds,
    sourcePage,
    createdAt: serverTimestamp()
  })
}
