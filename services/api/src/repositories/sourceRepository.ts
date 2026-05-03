import { 
  SourceRecord, 
  INITIAL_SOURCE_REGISTRY, 
  SourceFragment, 
  SAFE_DEMO_SOURCE_FRAGMENTS 
} from '@voteready/shared';
import { getFirestore } from '../config/firebase.js';

const COLLECTIONS = {
  SOURCE_REGISTRY: 'sourceRegistry',
  SOURCE_FRAGMENTS: 'sourceFragments'
};

/**
 * Repository for accessing source registry and fragments.
 * Supports Firestore with safe fallback to static seeds.
 */
export class SourceRepository {
  /**
   * Retrieves the full source registry.
   */
  async getSourceRegistry(): Promise<SourceRecord[]> {
    const db = getFirestore();
    if (!db) {
      return [...INITIAL_SOURCE_REGISTRY];
    }

    try {
      const snapshot = await db.collection(COLLECTIONS.SOURCE_REGISTRY).get();
      if (snapshot.empty) {
        return [...INITIAL_SOURCE_REGISTRY];
      }
      return snapshot.docs.map(doc => doc.data() as SourceRecord);
    } catch (error) {
      console.error('Error fetching source registry from Firestore:', error);
      return [...INITIAL_SOURCE_REGISTRY];
    }
  }

  /**
   * Retrieves source fragments by source ID.
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
   */
  async getAllFragments(): Promise<SourceFragment[]> {
    const db = getFirestore();
    if (!db) {
      return [...SAFE_DEMO_SOURCE_FRAGMENTS];
    }

    try {
      const snapshot = await db.collection(COLLECTIONS.SOURCE_FRAGMENTS).get();
      if (snapshot.empty) {
        return [...SAFE_DEMO_SOURCE_FRAGMENTS];
      }
      return snapshot.docs.map(doc => doc.data() as SourceFragment);
    } catch (error) {
      console.error('Error fetching all fragments from Firestore:', error);
      return [...SAFE_DEMO_SOURCE_FRAGMENTS];
    }
  }
}

export const sourceRepository = new SourceRepository();
