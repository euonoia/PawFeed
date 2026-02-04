import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';

interface AppExtra {
  EXPO_PUBLIC_FIREBASE_API_KEY: string;
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  EXPO_PUBLIC_FIREBASE_DATABASE_URL: string;
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  EXPO_PUBLIC_FIREBASE_APP_ID: string;
}


const extra = (Constants.expoConfig?.extra || {}) as AppExtra;

const firebaseConfig = {
  apiKey: extra.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: extra.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(firebaseApp);
export const rtdb = getDatabase(firebaseApp);
