import { doc, getDoc, setDoc } from "firebase/firestore/lite"
import { db, firebaseEnabled } from "@/lib/firebase/config"

export type ThemeColors = {
  /** RGB triplets e.g. "10 15 30" */
  navy:       string
  blue:       string
  blueLight:  string
  accent:     string  // red / highlight
}

export const defaultTheme: ThemeColors = {
  navy:      "10 15 30",
  blue:      "28 78 216",
  blueLight: "59 130 246",
  accent:    "239 68 68",
}

function canUse() {
  return firebaseEnabled && Boolean(db)
}

export async function getTheme(): Promise<ThemeColors> {
  if (!canUse()) return defaultTheme
  const snap = await getDoc(doc(db!, "settings", "theme"))
  if (!snap.exists()) return defaultTheme
  return { ...defaultTheme, ...(snap.data() as Partial<ThemeColors>) }
}

export async function updateTheme(colors: ThemeColors) {
  if (!canUse()) throw new Error("Firebase is not configured.")
  return setDoc(doc(db!, "settings", "theme"), colors, { merge: true })
}
