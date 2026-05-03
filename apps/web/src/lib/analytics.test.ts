import { describe, it, expect, vi } from 'vitest';
import { sanitizePayload, trackEvent } from './analytics';
import * as firebaseAnalytics from 'firebase/analytics';
import { getAnalyticsInstance } from './firebase';

// Mock Firebase
vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(true),
}));

vi.mock('./firebase', () => ({
  getAnalyticsInstance: vi.fn(),
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
  it('does not log event if analytics is disabled', async () => {
    // This is tricky because trackEvent is void and uses internal config
    // But we can verify it doesn't call getAnalyticsInstance
    
    // Set env mock
    const originalEnv = import.meta.env.VITE_ANALYTICS_ENABLED;
    import.meta.env.VITE_ANALYTICS_ENABLED = 'false';

    trackEvent('assistant_question_submitted', { language: 'english' });
    
    expect(getAnalyticsInstance).not.toHaveBeenCalled();
    
    import.meta.env.VITE_ANALYTICS_ENABLED = originalEnv;
  });
});
