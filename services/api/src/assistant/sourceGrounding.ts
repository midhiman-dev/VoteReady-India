import { SAFE_DEMO_SOURCE_FRAGMENTS } from '@voteready/shared';

export interface SourceGroundingContext {
  status: 'not_configured' | 'no_sources_available' | 'demo_safe';
  sourceCount: number;
  notes: string[];
}

export async function getSourceGroundingContext(): Promise<SourceGroundingContext> {
  // Read curated demo source fragments safely.
  const sourceCount = SAFE_DEMO_SOURCE_FRAGMENTS.length;
  
  return {
    status: 'demo_safe',
    sourceCount,
    notes: [
      `Found ${sourceCount} demo-safe source fragments for source-transparency context.`
    ],
  };
}

