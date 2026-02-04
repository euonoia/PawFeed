import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Determine which environment to use
const ENV = process.env.APP_ENV || 'development';

// Manually load the corresponding .env file
const envFilePath = path.resolve(process.cwd(), `.env.${ENV}`);
if (fs.existsSync(envFilePath)) {
  require('dotenv').config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}`);
} else {
  console.warn(`No .env file found for environment: ${ENV}, using defaults`);
}

// Define Firebase and other environment variables
const env = {
  development: {
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
  production: {
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_PROD,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD,
    EXPO_PUBLIC_FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL_PROD,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID_PROD,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID_PROD,
  },
};

export default ({ config }) => ({
  ...config,
  name: "PawFeed",
  slug: "PawFeed",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/pawfeed.png",
  scheme: "pawfeed",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kennysport.PawFeed",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.kennysport.PawFeed",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router"],
  experiments: { typedRoutes: true },
  extra: {
    router: {},
    eas: { projectId: "0919ecd1-0a5f-49df-80e1-58fe47392482" },
    ...env[ENV], 
  },
  owner: "kennysport",
});
