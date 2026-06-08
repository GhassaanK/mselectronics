"use client"

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase/config"

const googleProvider = new GoogleAuthProvider()

export function signInWithGoogle() {
  if (!auth) return Promise.reject(new Error("Firebase auth is not configured."))
  return signInWithPopup(auth, googleProvider)
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
