import { 
  SourceRecord,
  SourceFragment,
  findSourceRecordById,
  INITIAL_SOURCE_REGISTRY
} from '@voteready/shared';
import { sourceRepository } from '../repositories/sourceRepository.js';

export interface SourceGroundingContext {
  status: 'not_configured' | 'no_sources_available' | 'demo_safe';
  sourceCount: number;
  sources: SourceRecord[];
  fragments: SourceFragment[];
  notes: string[];
}

export async function getSourceGroundingContext(): Promise<SourceGroundingContext> {
  // Read source fragments from repository (Firestore with safe fallback)
  const fragments = await sourceRepository.getAllFragments();
  
  // Read source registry from repository (Firestore with safe fallback)
  const registry = await sourceRepository.getSourceRegistry();
  
  // Get unique source IDs from fragments
  const sourceIds = Array.from(new Set(fragments.map(f => f.sourceId)));
  
  // Lookup SourceRecords from the registry we just fetched
  const sources = sourceIds
    .map(id => findSourceRecordById(id, registry))
    .filter((s): s is SourceRecord => s !== undefined);
  
  return {
    status: sources.length > 0 ? 'demo_safe' : 'no_sources_available',
    sourceCount: sources.length,
    sources,
    fragments,
    notes: [
      `Found ${sources.length} unique source records linked to ${fragments.length} source fragments.`
    ],
  };
}

