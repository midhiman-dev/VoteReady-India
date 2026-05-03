import { describe, it, expect } from 'vitest';
import { getSavedGuidanceRepositoryStatus } from './savedGuidanceRepository';

describe('getSavedGuidanceRepositoryStatus', () => {
  it('should return local_storage mode when Firebase is disabled', () => {
    const status = getSavedGuidanceRepositoryStatus({
      VITE_FIREBASE_ENABLED: 'false',
    });
    expect(status.mode).toBe('local_storage');
    expect(status.cloudSyncEnabled).toBe(false);
    expect(status.message).toBe('Cloud sync is not active yet.');
  });

  it('should return local_storage mode by default with empty env', () => {
    const status = getSavedGuidanceRepositoryStatus({});
    expect(status.mode).toBe('local_storage');
    expect(status.cloudSyncEnabled).toBe(false);
    expect(status.message).toBe('Cloud sync is not active yet.');
  });

  it('should return firestore_unavailable when enabled but incomplete config', () => {
    const status = getSavedGuidanceRepositoryStatus({
      VITE_FIREBASE_ENABLED: 'true',
      VITE_FIREBASE_API_KEY: 'test-key',
      // Missing other required keys
    });
    expect(status.mode).toBe('firestore_unavailable');
    expect(status.cloudSyncEnabled).toBe(false);
    expect(status.message).toContain('incomplete configuration');
  });

  it('should return firestore_ready_shell when enabled and fully configured', () => {
    const status = getSavedGuidanceRepositoryStatus({
      VITE_FIREBASE_ENABLED: 'true',
      VITE_FIREBASE_API_KEY: 'test-key',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_APP_ID: 'test-app-id',
    });
    expect(status.mode).toBe('firestore_ready_shell');
    expect(status.cloudSyncEnabled).toBe(false); // Cloud sync still false without Auth
    expect(status.message).toContain('Firestore configuration is available');
    expect(status.message).toContain('account-based sync is not active');
  });
});
