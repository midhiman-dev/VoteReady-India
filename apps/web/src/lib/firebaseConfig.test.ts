import { describe, it, expect } from 'vitest';
import { getFirebaseClientConfigStatus } from './firebaseConfig';

describe('getFirebaseClientConfigStatus', () => {
  it('should be disabled by default with empty env', () => {
    const status = getFirebaseClientConfigStatus({});
    expect(status.enabled).toBe(false);
    expect(status.configured).toBe(false);
  });

  it('should be disabled when VITE_FIREBASE_ENABLED is false', () => {
    const status = getFirebaseClientConfigStatus({
      VITE_FIREBASE_ENABLED: 'false',
      VITE_FIREBASE_API_KEY: 'test-key',
    });
    expect(status.enabled).toBe(false);
    expect(status.configured).toBe(false);
  });

  it('should be enabled but not configured if keys are missing', () => {
    const status = getFirebaseClientConfigStatus({
      VITE_FIREBASE_ENABLED: 'true',
    });
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(false);
    expect(status.apiKeyPresent).toBe(false);
  });

  it('should be enabled and configured if all required keys are present', () => {
    const status = getFirebaseClientConfigStatus({
      VITE_FIREBASE_ENABLED: 'true',
      VITE_FIREBASE_API_KEY: 'test-key',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_APP_ID: 'test-app-id',
    });
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(true);
    expect(status.apiKeyPresent).toBe(true);
    expect(status.projectIdPresent).toBe(true);
    expect(status.appIdPresent).toBe(true);
  });

  it('should not expose actual config values in status object', () => {
    const apiKey = 'secret-key-123';
    const status = getFirebaseClientConfigStatus({
      VITE_FIREBASE_ENABLED: 'true',
      VITE_FIREBASE_API_KEY: apiKey,
    });
    
    const statusValues = Object.values(status);
    expect(statusValues).not.toContain(apiKey);
  });
});
