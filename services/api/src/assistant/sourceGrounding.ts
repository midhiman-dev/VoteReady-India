import { 
  SAFE_DEMO_SOURCE_FRAGMENTS, 
  findSourceRecordById, 
  INITIAL_SOURCE_REGISTRY,
  SourceRecord,
  SourceFragment
} from '@voteready/shared';

export interface SourceGroundingContext {
  status: 'not_configured' | 'no_sources_available' | 'demo_safe';
  sourceCount: number;
  sources: SourceRecord[];
  fragments: SourceFragment[];
  notes: string[];
}

export async function getSourceGroundingContext(): Promise<SourceGroundingContext> {
  // Read curated demo source fragments safely.
  const fragments = [...SAFE_DEMO_SOURCE_FRAGMENTS];
  const sourceCount = fragments.length;
  
  // Get unique source IDs from fragments
  const sourceIds = Array.from(new Set(fragments.map(f => f.sourceId)));
  
  // Lookup SourceRecords
  const sources = sourceIds
    .map(id => findSourceRecordById(id, INITIAL_SOURCE_REGISTRY))
    .filter((s): s is SourceRecord => s !== undefined);
  
  return {
    status: 'demo_safe',
    sourceCount: sources.length,
    sources,
    fragments,
    notes: [
      `Found ${sources.length} unique source records linked to ${fragments.length} demo-safe source fragments.`
    ],
  };
}

