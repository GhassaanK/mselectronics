"use client"

import { doc, setDoc } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"
import type { SiteSettings } from "@/types"

export async function updateSiteSettings(settings: SiteSettings) {
  if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.")
  return setDoc(doc(db, "settings", "site"), settings, { merge: true })
}
