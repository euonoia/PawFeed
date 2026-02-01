import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};


export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);


export const auth: Auth =
  getApps().length > 0 && getAuth(firebaseApp)
    ? getAuth(firebaseApp)
    : initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(firebaseApp);

export const rtdb = getDatabase(firebaseApp);
