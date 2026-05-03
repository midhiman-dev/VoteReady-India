import { AnalyticsEventName, AnalyticsEventPayload } from '@voteready/shared';
import { logEvent } from 'firebase/analytics';
import { getFirebaseClient } from './firebase';

/**
 * Analytics Configuration for the VoteReady India web app.
 * Controlled via environment variables.
 */
export interface AnalyticsConfig {
  enabled: boolean;
  debugMode: boolean;
}

/**
 * Returns the current analytics configuration.
 * @param env Optional environment object for testing.
 */
export const getAnalyticsConfig = (env: Record<string, string | undefined> = import.meta.env): AnalyticsConfig => ({
  enabled: env.VITE_ANALYTICS_ENABLED === 'true',
  debugMode: env.VITE_ANALYTICS_DEBUG_MODE === 'true',
});

/**
 * Whitelist of allowed payload fields to prevent accidental PII leakage.
 */
const ALLOWED_PAYLOAD_FIELDS: Array<keyof AnalyticsEventPayload> = [
  'language',
  'explanationMode',
  'responseStatus',
  'sourceCount',
  'journeyId',
  'topicId',
  'storageMode',
  'cloudSyncActive',
  'authMode',
  'signedIn',
  'appCheckEnabled',
  'remindersEnabled',
  'intentCategory',
  'sourceType',
  'freshnessState',
  'preferredChannelPlaceholder',
  'timingPreferencePlaceholder'
];

/**
 * Sanitizes a payload by removing any keys not in the whitelist.
 */
export const sanitizePayload = (payload: AnalyticsEventPayload): AnalyticsEventPayload => {
  const sanitized: Record<string, any> = {};
  
  for (const key of ALLOWED_PAYLOAD_FIELDS) {
    if (payload[key] !== undefined) {
      sanitized[key] = payload[key];
    }
  }
  
  return sanitized as AnalyticsEventPayload;
};

/**
 * Tracks an event safely.
 * 
 * Rules:
 * 1. Disabled by default via VITE_ANALYTICS_ENABLED.
 * 2. No personal data collection (PII).
 * 3. No raw question/response text tracking.
 * 4. App must not crash if analytics is unavailable.
 * 
 * @param name The name of the event to track.
 * @param payload Optional non-PII metadata for the event.
 */
export const trackEvent = (name: AnalyticsEventName, payload?: AnalyticsEventPayload): void => {
  const config = getAnalyticsConfig();
  
  if (!config.enabled) {
    return;
  }

  const sanitizedPayload = payload ? sanitizePayload(payload) : {};

  // Log to console if in debug mode
  if (config.debugMode) {
    console.log(`[Analytics] ${name}`, sanitizedPayload);
  }

  try {
    const { analytics } = getFirebaseClient();
    if (analytics) {
      logEvent(analytics, name, sanitizedPayload);
    }
  } catch (error) {
    // Fail silently to prevent app crashes due to analytics issues
    if (config.debugMode) {
      console.error('[Analytics Error]', error);
    }
  }
};
