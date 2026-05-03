import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseClientConfigStatus } from './firebaseConfig';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
const googleProvider = new GoogleAuthProvider();

/**
 * Initializes the Firebase client if enabled and properly configured.
 * Returns the Auth and Firestore instances if successful, otherwise undefined.
 */
export function getFirebaseClient() {
  if (auth && db) return { app, auth, db, googleProvider };

  const configStatus = getFirebaseClientConfigStatus();

  if (!configStatus.enabled || !configStatus.configured) {
    return { app: undefined, auth: undefined, db: undefined, googleProvider: undefined };
  }

  const firebaseConfig = {
    apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
    authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  };

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db, googleProvider };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: undefined, auth: undefined, db: undefined, googleProvider: undefined };
  }
}
