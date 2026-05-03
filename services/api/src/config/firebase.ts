import admin from 'firebase-admin';
import { getAppEnvironment } from '../utils/environment.js';

let db: admin.firestore.Firestore | null = null;

/**
 * Initializes and returns the Firestore instance if enabled.
 * Returns null if FIREBASE_ADMIN_ENABLED is not 'true'.
 */
export function getFirestore(): admin.firestore.Firestore | null {
  if (db) return db;

  const isEnabled = process.env.FIREBASE_ADMIN_ENABLED === 'true';
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!isEnabled) {
    console.log('Firebase Admin is disabled. Falling back to static data.');
    return null;
  }

  try {
    // If running on Cloud Run, it will use default credentials
    // For local dev, GOOGLE_APPLICATION_CREDENTIALS should be set if using a real project
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: projectId
      });
    }
    db = admin.firestore();
    console.log('Firebase Admin initialized successfully.');
    return db;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    return null;
  }
}
