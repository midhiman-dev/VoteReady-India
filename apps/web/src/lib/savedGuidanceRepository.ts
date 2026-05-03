import { SavedGuidanceItem } from '@voteready/shared';
import { getFirestoreInstance } from './firebase';
import { getFirebaseClientConfigStatus } from './firebaseConfig';
import * as localStore from './savedGuidanceStorage';

const COLLECTION_NAME = 'savedGuidance';

export type SavedGuidanceRepositoryMode =
  | 'local_storage'
  | 'firestore_unavailable'
  | 'firestore_active';

export interface SavedGuidanceRepositoryStatus {
  mode: SavedGuidanceRepositoryMode;
  cloudSyncEnabled: boolean;
  message: string;
}

/**
 * Returns the active repository status for Saved Guidance.
 */
export function getSavedGuidanceRepositoryStatus(
  isAuthenticated?: boolean,
  env?: any
): SavedGuidanceRepositoryStatus {
  const config = getFirebaseClientConfigStatus(env);

  if (!config.enabled) {
    return {
      mode: 'local_storage',
      cloudSyncEnabled: false,
      message: 'Cloud sync is not active (disabled by policy).',
    };
  }

  if (!config.configured) {
    return {
      mode: 'firestore_unavailable',
      cloudSyncEnabled: false,
      message: 'Cloud sync unavailable (missing configuration).',
    };
  }

  if (!isAuthenticated) {
    return {
      mode: 'local_storage',
      cloudSyncEnabled: false,
      message: 'Cloud sync is ready, but using local storage until you sign in.',
    };
  }

  return {
    mode: 'firestore_active',
    cloudSyncEnabled: true,
    message: 'Signed in: saved guidance is securely synced to your account.',
  };
}

/**
 * Saves a guidance item to the appropriate storage (Firestore or localStorage).
 */
export async function saveGuidance(item: SavedGuidanceItem, userId?: string): Promise<void> {
  if (!userId) {
    localStore.saveGuidanceItem(item);
    return;
  }

  const db = await getFirestoreInstance();
  if (!db) {
    localStore.saveGuidanceItem(item);
    return;
  }

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const docRef = doc(db, COLLECTION_NAME, item.id);
    await setDoc(docRef, {
      ...item,
      userId,
      localOnlyMarker: false,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firestore save failed, falling back to local', error);
    localStore.saveGuidanceItem(item);
  }
}

/**
 * Fetches all saved guidance for the user.
 */
export async function fetchSavedGuidance(userId?: string): Promise<SavedGuidanceItem[]> {
  if (!userId) {
    return localStore.getSavedGuidance();
  }

  const db = await getFirestoreInstance();
  if (!db) {
    return localStore.getSavedGuidance();
  }

  try {
    const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('savedTimestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as SavedGuidanceItem);
  } catch (error) {
    console.error('Firestore fetch failed, falling back to local', error);
    // In case of error, we fallback to local for a smooth UX
    return localStore.getSavedGuidance();
  }
}

/**
 * Removes a specific guidance item.
 */
export async function removeSavedGuidance(id: string, userId?: string): Promise<void> {
  if (!userId) {
    localStore.removeSavedGuidanceItem(id);
    return;
  }

  const db = await getFirestoreInstance();
  if (!db) {
    localStore.removeSavedGuidanceItem(id);
    return;
  }

  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Firestore delete failed', error);
    // Cleanup local just in case it was there
    localStore.removeSavedGuidanceItem(id);
  }
}

/**
 * Clears all saved guidance for the user.
 */
export async function clearSavedGuidance(userId?: string): Promise<void> {
  if (!userId) {
    localStore.clearAllSavedGuidance();
    return;
  }

  const db = await getFirestoreInstance();
  if (!db) {
    localStore.clearAllSavedGuidance();
    return;
  }

  try {
    const { collection, query, where, getDocs, writeBatch } = await import('firebase/firestore');
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Firestore clear failed', error);
    localStore.clearAllSavedGuidance();
  }
}
