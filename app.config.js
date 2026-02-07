export default ({ config }) => ({
  ...config,
  name: 'PawFeed',
  slug: 'PawFeed',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/pawfeed.png',
  scheme: 'pawfeed',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kennysport.PawFeed',
  },
  android: {
    package: 'com.kennysport.PawFeed',
    adaptiveIcon: {
      foregroundImage: './assets/pawfeed.png',
      backgroundColor: '#ffffff',
    },
   
    usesCleartextTraffic: true, 
  },
  extra: {
    eas: { projectId: '0919ecd1-0a5f-49df-80e1-58fe47392482' },
    EXPO_PUBLIC_FIREBASE_API_KEY: "AIzaSyCgaWtvBXBvZa_-Jtg6CAVaQClPWiCRGng",
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: "iotfoodfeeder.firebaseapp.com",
    EXPO_PUBLIC_FIREBASE_DATABASE_URL: "https://iotfoodfeeder-default-rtdb.firebaseio.com",
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: "iotfoodfeeder",
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: "iotfoodfeeder.firebasestorage.app",
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "154077067174",
    EXPO_PUBLIC_FIREBASE_APP_ID: "1:154077067174:web:bd91970270e358c3fc4167",
  },
  owner: 'kennysport',
});