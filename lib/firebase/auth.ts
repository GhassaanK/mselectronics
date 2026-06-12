"use client"

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase/config"

export function signInWithEmail(email: string, password: string) {
  if (!auth) return Promise.reject(new Error("Firebase auth is not configured."))
  return signInWithEmailAndPassword(auth, email, password)
}

export function signOut() {
  if (!auth) return Promise.resolve()
  return firebaseSignOut(auth)
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null)
    return () => undefined
  }
  return onAuthStateChanged(auth, callback)
}