import { getApps, initializeApp } from "firebase/app"
import type { FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import type { Auth } from "firebase/auth"
import { getFirestore } from "firebase/firestore/lite"
import type { Firestore } from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
export const app: FirebaseApp | null = firebaseEnabled ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null

export const db: Firestore | null = app ? getFirestore(app) : null
export const auth: Auth | null = app ? getAuth(app) : null
