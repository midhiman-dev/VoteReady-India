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
  getAnalyticsInstance: vi.fn().mockResolvedValue({}),
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

  it('explicitly strips raw question and answer text fields', () => {
    const payload = {
      question: 'How do I vote for X?',
      answer: 'This is a detailed answer.',
      language: 'hindi'
    };
    const sanitized = sanitizePayload(payload);
    expect((sanitized as any).question).toBeUndefined();
    expect((sanitized as any).answer).toBeUndefined();
    expect(sanitized.language).toBe('hindi');
  });

  it('handles empty or undefined payload', () => {
    expect(sanitizePayload({})).toEqual({});
  });
});

describe('trackEvent safety', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sanitizes data before calling logEvent', async () => {
    // Set env mock via the config helper's perspective
    const mockLogEvent = vi.mocked(firebaseAnalytics.logEvent);
    const mockAnalytics = { app: {} };
    vi.mocked(getAnalyticsInstance).mockResolvedValue(mockAnalytics as any);

    // We can't easily mock import.meta.env directly in vitest without setup
    // But trackEvent uses getAnalyticsConfig which uses import.meta.env
    // We can mock getAnalyticsConfig or the env directly if we use vi.stubEnv
    vi.stubEnv('VITE_ANALYTICS_ENABLED', 'true');

    trackEvent('mode_changed', { 
      explanationMode: 'detailed', 
      userQuery: 'private question' 
    } as any);

    // Wait for the promise in trackEvent
    await vi.waitFor(() => {
      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'mode_changed',
        expect.objectContaining({ explanationMode: 'detailed' })
      );
    });
    
    // Check that userQuery was stripped
    const callArgs = mockLogEvent.mock.calls[0][2];
    expect(callArgs?.userQuery).toBeUndefined();

    vi.unstubAllEnvs();
  });

  it('does not log event if analytics is disabled', async () => {
    vi.stubEnv('VITE_ANALYTICS_ENABLED', 'false');

    trackEvent('assistant_question_submitted', { language: 'english' });
    
    expect(getAnalyticsInstance).not.toHaveBeenCalled();
    
    vi.unstubAllEnvs();
  });
});
