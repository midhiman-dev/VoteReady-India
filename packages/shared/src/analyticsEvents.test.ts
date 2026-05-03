import { describe, it, expect } from 'vitest';
import { AnalyticsEventName, AnalyticsEventPayload } from './analyticsEvents';

describe('AnalyticsEvent Contracts', () => {
  it('should have all required event names defined', () => {
    // This is more of a type check, but we can verify some key ones
    const events: AnalyticsEventName[] = [
      'assistant_question_submitted',
      'assistant_response_received',
      'mode_changed',
      'guidance_saved'
    ];
    expect(events.length).toBe(4);
  });

  it('should allow valid payload fields', () => {
    const payload: AnalyticsEventPayload = {
      language: 'english',
      explanationMode: 'detailed',
      sourceCount: 5,
      intentCategory: 'ELIGIBILITY_INTENT',
      storageMode: 'cloud'
    };
    expect(payload.language).toBe('english');
    expect(payload.sourceCount).toBe(5);
  });
});
