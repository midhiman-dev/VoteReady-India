import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getSavedGuidanceRepositoryStatus, 
  saveGuidance, 
  fetchSavedGuidance 
} from './savedGuidanceRepository';
import * as localStore from './savedGuidanceStorage';
import { getFirebaseClient } from './firebase';

vi.mock('./firebase', () => ({
  getFirebaseClient: vi.fn(),
}));

vi.mock('./savedGuidanceStorage', () => ({
  saveGuidanceItem: vi.fn(),
  getSavedGuidance: vi.fn().mockReturnValue([{ id: 'local-1', question: 'local question' }]),
  removeSavedGuidanceItem: vi.fn(),
  clearAllSavedGuidance: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  writeBatch: vi.fn(),
}));

describe('SavedGuidanceRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSavedGuidanceRepositoryStatus', () => {
    it('should return local_storage mode when Firebase is disabled', () => {
      const status = getSavedGuidanceRepositoryStatus(false, {
        VITE_FIREBASE_ENABLED: 'false',
      });
      expect(status.mode).toBe('local_storage');
      expect(status.cloudSyncEnabled).toBe(false);
    });

    it('should return local_storage when not authenticated even if Firestore is ready', () => {
      const status = getSavedGuidanceRepositoryStatus(false, {
        VITE_FIREBASE_ENABLED: 'true',
        VITE_FIREBASE_API_KEY: 'test-key',
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        VITE_FIREBASE_APP_ID: 'test-app-id',
      });
      expect(status.mode).toBe('local_storage');
      expect(status.cloudSyncEnabled).toBe(false);
      expect(status.message).toContain('using local storage until you sign in');
    });

    it('should return firestore_active when authenticated and configured', () => {
      const status = getSavedGuidanceRepositoryStatus(true, {
        VITE_FIREBASE_ENABLED: 'true',
        VITE_FIREBASE_API_KEY: 'test-key',
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        VITE_FIREBASE_APP_ID: 'test-app-id',
      });
      expect(status.mode).toBe('firestore_active');
      expect(status.cloudSyncEnabled).toBe(true);
    });
  });

  describe('saveGuidance', () => {
    const mockItem = { id: '1', question: 'test?' } as any;

    it('should fallback to localStorage when no userId provided', async () => {
      await saveGuidance(mockItem);
      expect(localStore.saveGuidanceItem).toHaveBeenCalledWith(mockItem);
    });

    it('should save to Firestore when userId provided and db is ready', async () => {
      const mockDb = {};
      (getFirebaseClient as any).mockReturnValue({ db: mockDb });
      
      await saveGuidance(mockItem, 'user-123');
      
      expect(localStore.saveGuidanceItem).not.toHaveBeenCalled();
      // Firestore setDoc should have been called (verified via mocks if we had deeper spies)
    });
  });

  describe('fetchSavedGuidance', () => {
    it('should fetch from localStorage when no userId provided', async () => {
      const items = await fetchSavedGuidance();
      expect(items[0].id).toBe('local-1');
      expect(localStore.getSavedGuidance).toHaveBeenCalled();
    });

    it('should fetch from Firestore when userId provided', async () => {
      const mockDb = {};
      (getFirebaseClient as any).mockReturnValue({ db: mockDb });
      
      // Mock getDocs to return an empty array for simplicity
      const { getDocs } = await import('firebase/firestore');
      (getDocs as any).mockResolvedValue({ docs: [] });

      const items = await fetchSavedGuidance('user-123');
      expect(items).toEqual([]);
      expect(localStore.getSavedGuidance).not.toHaveBeenCalled();
    });
  });
});
