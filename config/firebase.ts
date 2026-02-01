// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth"; // use browserLocalPersistence in Expo
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase
export const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// Initialize Auth — in React Native, AsyncStorage is used internally now
export const auth = initializeAuth(firebaseApp, {
  persistence: browserLocalPersistence, // fallback that works in Expo
});

// Firestore and RTDB
export const db = getFirestore(firebaseApp);
export const rtdb = getDatabase(firebaseApp);
