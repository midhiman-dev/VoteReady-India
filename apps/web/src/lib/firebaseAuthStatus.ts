import { getFirebaseClientConfigStatus, ImportMetaEnvLike } from './firebaseConfig';

export interface FirebaseAuthStatus {
  enabled: boolean;
  configured: boolean;
  providerMode: string;
  googleEnabled: boolean;
  signInActive: boolean;
  cloudSyncActive: boolean;
  statusLabel: string;
}

/**
 * Returns the status of the Firebase Auth shell based on environment variables.
 * Auth is disabled by default and requires explicit configuration.
 * All active sign-in and sync behaviors remain disabled in this shell task.
 */
export function getFirebaseAuthStatus(
  env: ImportMetaEnvLike = (import.meta as any).env
): FirebaseAuthStatus {
  const firebaseStatus = getFirebaseClientConfigStatus(env);
  const authEnabled = env.VITE_FIREBASE_AUTH_ENABLED === 'true';
  const providerMode = env.VITE_FIREBASE_AUTH_PROVIDER_MODE || 'disabled';
  const googleEnabled = env.VITE_FIREBASE_AUTH_GOOGLE_ENABLED === 'true';

  // Task 003: sign-in and cloud sync are now active if configured
  const signInActive = authEnabled && firebaseStatus.configured;
  const cloudSyncActive = authEnabled && firebaseStatus.configured;

  let statusLabel = 'Auth disabled by default';
  
  if (authEnabled) {
    if (!firebaseStatus.configured) {
      statusLabel = 'Auth enabled but Firebase incomplete';
    } else {
      statusLabel = 'Auth Active';
    }
  }

  return {
    enabled: authEnabled,
    configured: firebaseStatus.configured && authEnabled,
    providerMode,
    googleEnabled,
    signInActive,
    cloudSyncActive,
    statusLabel,
  };
}
