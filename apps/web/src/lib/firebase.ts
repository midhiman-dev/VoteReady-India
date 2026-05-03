import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getFirebaseClientConfigStatus } from './firebaseConfig';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
const googleProvider = new GoogleAuthProvider();

/**
 * Initializes the Firebase client if enabled and properly configured.
 * Returns the Auth, Firestore, and Analytics instances if successful, otherwise undefined.
 */
export function getFirebaseClient() {
  if (auth && db) return { app, auth, db, analytics, googleProvider };

  const configStatus = getFirebaseClientConfigStatus();

  if (!configStatus.enabled || !configStatus.configured) {
    return { app: undefined, auth: undefined, db: undefined, analytics: undefined, googleProvider: undefined };
  }

  const firebaseConfig = {
    apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
    authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
    measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Analytics is not supported in all environments (e.g. SSR)
    isSupported().then(yes => {
      if (yes && app) analytics = getAnalytics(app);
    });

    return { app, auth, db, analytics, googleProvider };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: undefined, auth: undefined, db: undefined, analytics: undefined, googleProvider: undefined };
  }
}
