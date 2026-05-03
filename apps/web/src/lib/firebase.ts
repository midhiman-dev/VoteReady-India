import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseClientConfigStatus } from './firebaseConfig';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
const googleProvider = new GoogleAuthProvider();

/**
 * Initializes the Firebase client if enabled and properly configured.
 * Returns the Auth instance if successful, otherwise undefined.
 */
export function getFirebaseClient() {
  if (auth) return { app, auth, googleProvider };

  const configStatus = getFirebaseClientConfigStatus();

  if (!configStatus.enabled || !configStatus.configured) {
    return { app: undefined, auth: undefined, googleProvider: undefined };
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
    return { app, auth, googleProvider };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: undefined, auth: undefined, googleProvider: undefined };
  }
}
