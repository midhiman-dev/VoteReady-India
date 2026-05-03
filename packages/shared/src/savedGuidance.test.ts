import { describe, it, expect } from 'vitest';
import { SavedGuidanceItem, SAVED_GUIDANCE_STORAGE_KEY } from './savedGuidance';

describe('SavedGuidance Contracts', () => {
  it('should define a consistent storage key', () => {
    expect(SAVED_GUIDANCE_STORAGE_KEY).toBe('voteready.savedGuidance.v1');
  });

  it('should allow valid item structure', () => {
    const item: SavedGuidanceItem = {
      id: 'item-1',
      question: 'How do I vote?',
      responseStatus: 'answered',
      language: 'english',
      explanationMode: 'simple',
      savedTimestamp: '2026-05-03T12:00:00Z',
      shortSummary: 'Summary of voting.',
      sourceCount: 2,
      localOnlyMarker: false
    };
    expect(item.id).toBe('item-1');
    expect(item.responseStatus).toBe('answered');
  });
});
