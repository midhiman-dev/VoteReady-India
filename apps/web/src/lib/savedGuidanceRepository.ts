import { getFirebaseClientConfigStatus } from './firebaseConfig';

export type SavedGuidanceRepositoryMode =
  | 'local_storage'
  | 'firestore_unavailable'
  | 'firestore_ready_shell';

export interface SavedGuidanceRepositoryStatus {
  mode: SavedGuidanceRepositoryMode;
  cloudSyncEnabled: boolean;
  message: string;
}

/**
 * Returns the active repository status for Saved Guidance.
 * Currently, localStorage is always the active storage, but this
 * helper prepares the UI for future Firestore integration.
 */
export function getSavedGuidanceRepositoryStatus(
  env?: any
): SavedGuidanceRepositoryStatus {
  const config = getFirebaseClientConfigStatus(env);

  // If Firebase is explicitly disabled (default)
  if (!config.enabled) {
    return {
      mode: 'local_storage',
      cloudSyncEnabled: false,
      message: 'Cloud sync is not active yet.',
    };
  }

  // If Firebase is enabled but missing required config
  if (!config.configured) {
    return {
      mode: 'firestore_unavailable',
      cloudSyncEnabled: false,
      message: 'Cloud sync unavailable (incomplete configuration).',
    };
  }

  // If Firebase is configured but Auth is not yet present
  // Note: cloudSyncEnabled remains false until Auth is implemented in a future task
  return {
    mode: 'firestore_ready_shell',
    cloudSyncEnabled: false,
    message: 'Firestore configuration is available, but account-based sync is not active until a future Auth task.',
  };
}
