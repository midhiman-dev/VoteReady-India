export interface FirebaseClientConfigStatus {
  enabled: boolean;
  configured: boolean;
  projectIdPresent: boolean;
  appIdPresent: boolean;
  apiKeyPresent: boolean;
  authDomainPresent: boolean;
}

export interface ImportMetaEnvLike {
  VITE_FIREBASE_ENABLED?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  [key: string]: string | undefined;
}

/**
 * Returns the status of the Firebase client configuration based on environment variables.
 * Firebase is disabled by default and requires explicit configuration.
 */
export function getFirebaseClientConfigStatus(
  env: ImportMetaEnvLike = (import.meta as any).env
): FirebaseClientConfigStatus {
  const enabled = env.VITE_FIREBASE_ENABLED === 'true';
  const apiKeyPresent = !!env.VITE_FIREBASE_API_KEY;
  const projectIdPresent = !!env.VITE_FIREBASE_PROJECT_ID;
  const appIdPresent = !!env.VITE_FIREBASE_APP_ID;
  const authDomainPresent = !!env.VITE_FIREBASE_AUTH_DOMAIN;

  // Configuration is considered complete if enabled and core fields are present
  const configured = enabled && apiKeyPresent && projectIdPresent && appIdPresent;

  return {
    enabled,
    configured,
    projectIdPresent,
    appIdPresent,
    apiKeyPresent,
    authDomainPresent,
  };
}
