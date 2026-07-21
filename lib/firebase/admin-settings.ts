"use client"

import { doc, setDoc } from "firebase/firestore/lite"
import { auth, db, firebaseEnabled } from "@/lib/firebase/config"
import type { SiteSettings } from "@/types"

async function requireAdminUser() {
  if (!auth?.currentUser) {
    throw new Error("You must be signed in to manage settings.")
  }

  await auth.currentUser.getIdToken(true)
}

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep) as T
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, fieldValue]) => fieldValue !== undefined)
        .map(([key, fieldValue]) => [key, stripUndefinedDeep(fieldValue)])
    ) as T
  }

  return value
}

export async function updateSiteSettings(settings: SiteSettings) {
  await requireAdminUser()

  if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.")
  return setDoc(doc(db, "settings", "site"), stripUndefinedDeep(settings), { merge: true })
}
