import { 
  SourceRecord, 
  INITIAL_SOURCE_REGISTRY, 
  SourceFragment, 
  SAFE_DEMO_SOURCE_FRAGMENTS 
} from '@voteready/shared';
import { getFirestore } from '../config/firebase.js';
import { sourceCache } from './sourceCache.js';

const COLLECTIONS = {
  SOURCE_REGISTRY: 'sourceRegistry',
  SOURCE_FRAGMENTS: 'sourceFragments'
};

/**
 * Repository for accessing source registry and fragments.
 * Supports Firestore with safe fallback to static seeds.
 * Results are cached in-memory for SOURCE_CACHE_TTL_MS (default 5 minutes)
 * to avoid repeated Firestore reads on every assistant request.
 */
export class SourceRepository {
  /**
   * Retrieves the full source registry.
   * Returns cached result if available and unexpired.
   */
  async getSourceRegistry(): Promise<SourceRecord[]> {
    // Check cache first
    const cached = sourceCache.getRegistry();
    if (cached !== null) {
      return cached;
    }

    const db = getFirestore();
    if (!db) {
      const result = [...INITIAL_SOURCE_REGISTRY];
      sourceCache.setRegistry(result);
      return result;
    }

    try {
      const snapshot = await db.collection(COLLECTIONS.SOURCE_REGISTRY).get();
      const result = snapshot.empty
        ? [...INITIAL_SOURCE_REGISTRY]
        : snapshot.docs.map(doc => doc.data() as SourceRecord);
      sourceCache.setRegistry(result);
      return result;
    } catch (error) {
      console.error('Error fetching source registry from Firestore:', error);
      // Do not cache on error — allow retry next request
      return [...INITIAL_SOURCE_REGISTRY];
    }
  }

  /**
   * Retrieves source fragments by source ID.
   * Note: This bypasses the shared fragments cache because it filters by sourceId.
   */
  async getFragmentsBySourceId(sourceId: string): Promise<SourceFragment[]> {
    const db = getFirestore();
    if (!db) {
      return SAFE_DEMO_SOURCE_FRAGMENTS.filter(f => f.sourceId === sourceId);
    }

    try {
      const snapshot = await db.collection(COLLECTIONS.SOURCE_FRAGMENTS)
        .where('sourceId', '==', sourceId)
        .get();
      
      if (snapshot.empty) {
        return SAFE_DEMO_SOURCE_FRAGMENTS.filter(f => f.sourceId === sourceId);
      }
      
      return snapshot.docs.map(doc => doc.data() as SourceFragment);
    } catch (error) {
      console.error(`Error fetching fragments for source ${sourceId} from Firestore:`, error);
      return SAFE_DEMO_SOURCE_FRAGMENTS.filter(f => f.sourceId === sourceId);
    }
  }

  /**
   * Retrieves all source fragments.
   * Returns cached result if available and unexpired.
   */
  async getAllFragments(): Promise<SourceFragment[]> {
    // Check cache first
    const cached = sourceCache.getFragments();
    if (cached !== null) {
      return cached;
    }

    const db = getFirestore();
    if (!db) {
      const result = [...SAFE_DEMO_SOURCE_FRAGMENTS];
      sourceCache.setFragments(result);
      return result;
    }

    try {
      const snapshot = await db.collection(COLLECTIONS.SOURCE_FRAGMENTS).get();
      const result = snapshot.empty
        ? [...SAFE_DEMO_SOURCE_FRAGMENTS]
        : snapshot.docs.map(doc => doc.data() as SourceFragment);
      sourceCache.setFragments(result);
      return result;
    } catch (error) {
      console.error('Error fetching all fragments from Firestore:', error);
      // Do not cache on error — allow retry next request
      return [...SAFE_DEMO_SOURCE_FRAGMENTS];
    }
  }
}

export const sourceRepository = new SourceRepository();
