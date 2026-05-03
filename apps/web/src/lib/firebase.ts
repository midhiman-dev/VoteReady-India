import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import type { Auth, GoogleAuthProvider as GoogleAuthProviderType } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';
import { getFirebaseClientConfigStatus } from './firebaseConfig';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let googleProvider: GoogleAuthProviderType | undefined;

/**
 * Initializes and returns the Firebase App instance if configured.
 */
function getApp(): FirebaseApp | undefined {
  if (app) return app;

  const configStatus = getFirebaseClientConfigStatus();
  if (!configStatus.enabled || !configStatus.configured) {
    return undefined;
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
    return app;
  } catch (error) {
    console.error('Failed to initialize Firebase App:', error);
    return undefined;
  }
}

/**
 * Lazily gets the Firebase Auth instance.
 */
export async function getAuthInstance(): Promise<Auth | undefined> {
  if (auth) return auth;
  const app = getApp();
  if (!app) return undefined;

  try {
    const { getAuth } = await import('firebase/auth');
    auth = getAuth(app);
    return auth;
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
    return undefined;
  }
}

/**
 * Lazily gets the Firestore instance.
 */
export async function getFirestoreInstance(): Promise<Firestore | undefined> {
  if (db) return db;
  const app = getApp();
  if (!app) return undefined;

  try {
    const { getFirestore } = await import('firebase/firestore');
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    return undefined;
  }
}

/**
 * Lazily gets the Analytics instance.
 */
export async function getAnalyticsInstance(): Promise<Analytics | undefined> {
  if (analytics) return analytics;
  const app = getApp();
  if (!app) return undefined;

  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
    return analytics;
  } catch (error) {
    console.error('Failed to initialize Analytics:', error);
    return undefined;
  }
}

/**
 * Lazily gets the Google Auth Provider.
 */
export async function getGoogleProviderInstance(): Promise<GoogleAuthProviderType | undefined> {
  if (googleProvider) return googleProvider;
  try {
    const { GoogleAuthProvider } = await import('firebase/auth');
    googleProvider = new GoogleAuthProvider();
    return googleProvider;
  } catch (error) {
    console.error('Failed to initialize Google Auth Provider:', error);
    return undefined;
  }
}

/**
 * Legacy wrapper for backward compatibility where sync access was expected.
 * Note: Members will be undefined if not already initialized.
 * Use specific async getters (getAuthInstance, etc.) for reliable lazy loading.
 */
export function getFirebaseClient() {
  return { 
    app: getApp(), 
    auth, 
    db, 
    analytics, 
    googleProvider 
  };
}
