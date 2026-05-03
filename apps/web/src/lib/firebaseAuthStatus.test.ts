import { describe, it, expect } from 'vitest';
import { getFirebaseAuthStatus } from './firebaseAuthStatus';

describe('getFirebaseAuthStatus', () => {
  it('should return disabled by default when no env vars are present', () => {
    const status = getFirebaseAuthStatus({});
    expect(status.enabled).toBe(false);
    expect(status.statusLabel).toBe('Auth disabled by default');
    expect(status.signInActive).toBe(false);
    expect(status.cloudSyncActive).toBe(false);
  });

  it('should return inactive when enabled but Firebase is incomplete', () => {
    const env = {
      VITE_FIREBASE_AUTH_ENABLED: 'true',
      VITE_FIREBASE_ENABLED: 'true',
      // Missing other Firebase keys
    };
    const status = getFirebaseAuthStatus(env);
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(false);
    expect(status.statusLabel).toBe('Auth enabled but Firebase incomplete remains inactive');
  });

  it('should return ready-shell status when enabled and Firebase is configured', () => {
    const env = {
      VITE_FIREBASE_AUTH_ENABLED: 'true',
      VITE_FIREBASE_ENABLED: 'true',
      VITE_FIREBASE_API_KEY: 'fake-key',
      VITE_FIREBASE_PROJECT_ID: 'fake-project',
      VITE_FIREBASE_APP_ID: 'fake-app',
    };
    const status = getFirebaseAuthStatus(env);
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(true);
    expect(status.statusLabel).toBe('Auth enabled and Firebase configured returns ready-shell status');
    expect(status.signInActive).toBe(false); // Must remain false in Task 030
    expect(status.cloudSyncActive).toBe(false); // Must remain false in Task 030
  });

  it('should preserve provider mode and google enabled settings', () => {
    const env = {
      VITE_FIREBASE_AUTH_ENABLED: 'true',
      VITE_FIREBASE_AUTH_PROVIDER_MODE: 'test-mode',
      VITE_FIREBASE_AUTH_GOOGLE_ENABLED: 'true',
    };
    const status = getFirebaseAuthStatus(env);
    expect(status.providerMode).toBe('test-mode');
    expect(status.googleEnabled).toBe(true);
  });
});
