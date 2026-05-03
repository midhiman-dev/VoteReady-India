import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sourceRepository } from './sourceRepository.js';
import * as firebaseConfig from '../config/firebase.js';
import { sourceCache } from './sourceCache.js';
import { INITIAL_SOURCE_REGISTRY, SAFE_DEMO_SOURCE_FRAGMENTS } from '@voteready/shared';

vi.mock('../config/firebase.js', () => ({
  getFirestore: vi.fn()
}));

describe('SourceRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sourceCache.clear();
  });

  describe('getSourceRegistry', () => {
    it('should return static registry when Firestore is disabled', async () => {
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(null);
      const sources = await sourceRepository.getSourceRegistry();
      expect(sources).toEqual(INITIAL_SOURCE_REGISTRY);
    });

    it('should return Firestore data when available', async () => {
      const mockDocs = [
        { data: () => ({ id: 'fs-source-1', title: 'Firestore Source' }) }
      ];
      const mockSnapshot = { 
        empty: false, 
        docs: mockDocs 
      };
      const mockCollection = {
        get: vi.fn().mockResolvedValue(mockSnapshot)
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };

      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);
      
      const sources = await sourceRepository.getSourceRegistry();
      expect(sources).toHaveLength(1);
      expect(sources[0].id).toBe('fs-source-1');
    });

    it('should fall back to static registry when Firestore collection is empty', async () => {
      const mockSnapshot = { empty: true, docs: [] };
      const mockCollection = {
        get: vi.fn().mockResolvedValue(mockSnapshot)
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };

      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);
      
      const sources = await sourceRepository.getSourceRegistry();
      expect(sources).toEqual(INITIAL_SOURCE_REGISTRY);
    });

    it('should fall back to static registry when Firestore fails', async () => {
      const mockCollection = {
        get: vi.fn().mockRejectedValue(new Error('Firestore error'))
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };

      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);
      
      const sources = await sourceRepository.getSourceRegistry();
      expect(sources).toEqual(INITIAL_SOURCE_REGISTRY);
    });

    it('should serve registry from cache on second call, avoiding Firestore', async () => {
      const mockDocs = [
        { data: () => ({ id: 'cached-source', title: 'Cached Source' }) }
      ];
      const mockSnapshot = { empty: false, docs: mockDocs };
      const mockCollection = {
        get: vi.fn().mockResolvedValue(mockSnapshot)
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);

      // First call: Firestore is hit
      await sourceRepository.getSourceRegistry();
      // Second call: should be served from cache
      await sourceRepository.getSourceRegistry();

      expect(mockCollection.get).toHaveBeenCalledTimes(1);
    });

    it('should not cache result when Firestore throws an error', async () => {
      const mockCollection = {
        get: vi.fn().mockRejectedValue(new Error('Firestore error'))
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);

      // First call: error, no cache set
      await sourceRepository.getSourceRegistry();
      // Second call: should hit Firestore again (not cached fallback)
      await sourceRepository.getSourceRegistry();

      expect(mockCollection.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllFragments', () => {
    it('should return static fragments when Firestore is disabled', async () => {
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(null);
      const fragments = await sourceRepository.getAllFragments();
      expect(fragments).toEqual(SAFE_DEMO_SOURCE_FRAGMENTS);
    });

    it('should serve fragments from cache on second call, avoiding Firestore', async () => {
      const mockDocs = [
        { data: () => ({ id: 'frag-1', sourceId: 'src-1', content: 'Cached fragment' }) }
      ];
      const mockSnapshot = { empty: false, docs: mockDocs };
      const mockCollection = {
        get: vi.fn().mockResolvedValue(mockSnapshot)
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);

      // First call: Firestore is hit
      await sourceRepository.getAllFragments();
      // Second call: should be served from cache
      await sourceRepository.getAllFragments();

      expect(mockCollection.get).toHaveBeenCalledTimes(1);
    });

    it('should not cache result when Firestore throws an error', async () => {
      const mockCollection = {
        get: vi.fn().mockRejectedValue(new Error('Firestore error'))
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);

      await sourceRepository.getAllFragments();
      await sourceRepository.getAllFragments();

      expect(mockCollection.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getFragmentsBySourceId', () => {
    it('should return static fragments when Firestore is disabled', async () => {
      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(null);
      const sourceId = 'eci-official-website';
      const fragments = await sourceRepository.getFragmentsBySourceId(sourceId);
      const expected = SAFE_DEMO_SOURCE_FRAGMENTS.filter(f => f.sourceId === sourceId);
      expect(fragments).toEqual(expected);
    });

    it('should return Firestore fragments when available', async () => {
      const mockDocs = [
        { data: () => ({ id: 'fs-frag-1', sourceId: 'src-1', content: 'Firestore Fragment' }) }
      ];
      const mockSnapshot = { 
        empty: false, 
        docs: mockDocs 
      };
      const mockWhere = {
        get: vi.fn().mockResolvedValue(mockSnapshot)
      };
      const mockCollection = {
        where: vi.fn().mockReturnValue(mockWhere)
      };
      const mockDb = {
        collection: vi.fn().mockReturnValue(mockCollection)
      };

      vi.mocked(firebaseConfig.getFirestore).mockReturnValue(mockDb as any);
      
      const fragments = await sourceRepository.getFragmentsBySourceId('src-1');
      expect(fragments).toHaveLength(1);
      expect(fragments[0].id).toBe('fs-frag-1');
    });
  });
});
