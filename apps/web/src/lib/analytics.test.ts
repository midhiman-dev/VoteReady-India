import { describe, it, expect, vi } from 'vitest';
import { sanitizePayload, trackEvent, getAnalyticsConfig } from './analytics';
import { AnalyticsEventPayload } from '@voteready/shared';
import * as firebaseAnalytics from 'firebase/analytics';
import * as firebaseClient from './firebase';

// Mock Firebase
vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('./firebase', () => ({
  getFirebaseClient: vi.fn(),
}));

describe('analytics sanitization', () => {
  it('strips non-whitelisted fields from payload', () => {
    const rawPayload: any = {
      language: 'hindi',
      explanationMode: 'simple',
      sensitiveField: 'should be removed',
      userQuestion: 'this is private',
      intentCategory: 'ELIGIBILITY_INTENT'
    };

    const sanitized = sanitizePayload(rawPayload);

    expect(sanitized.language).toBe('hindi');
    expect(sanitized.explanationMode).toBe('simple');
    expect(sanitized.intentCategory).toBe('ELIGIBILITY_INTENT');
    expect((sanitized as any).sensitiveField).toBeUndefined();
    expect((sanitized as any).userQuestion).toBeUndefined();
  });

  it('handles empty or undefined payload', () => {
    expect(sanitizePayload({})).toEqual({});
  });
});

describe('trackEvent safety', () => {
  it('does not log event if analytics is disabled', () => {
    // Mock config to disabled
    vi.mock('./analytics', async () => {
      const actual = await vi.importActual<any>('./analytics');
      return {
        ...actual,
        getAnalyticsConfig: vi.fn(() => ({ enabled: false, debugMode: false })),
      };
    });

    trackEvent('assistant_question_submitted', { language: 'english' });
    expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
  });
});
