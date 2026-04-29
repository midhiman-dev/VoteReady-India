export interface SourceGroundingContext {
  status: 'not_configured' | 'no_sources_available';
  sourceCount: number;
  notes: string[];
}

export async function getSourceGroundingContext(): Promise<SourceGroundingContext> {
  // Placeholder implementation for future source fragment retrieval.
  // Currently not reading source content or requiring real sources.
  return {
    status: 'not_configured',
    sourceCount: 0,
    notes: ['Source-grounding is not implemented in this skeleton.'],
  };
}
