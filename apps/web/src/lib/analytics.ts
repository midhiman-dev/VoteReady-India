import { AnalyticsEventName, AnalyticsEventPayload } from '@voteready/shared';

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
 * Tracks an event safely.
 * 
 * Rules:
 * 1. Disabled by default.
 * 2. No external network calls.
 * 3. No personal data collection.
 * 4. No raw question/response text tracking.
 * 5. Console debug mode only if explicitly enabled.
 * 
 * @param name The name of the event to track.
 * @param payload Optional non-PII metadata for the event.
 */
export const trackEvent = (name: AnalyticsEventName, payload?: AnalyticsEventPayload): void => {
  const config = getAnalyticsConfig();
  
  if (!config.enabled) {
    return;
  }

  // Implementation is a no-op by design in this shell,
  // except for optional console logging in debug mode.
  if (config.debugMode) {
    // Note: The AnalyticsEventPayload type already restricts fields to safe options.
    // We log a shallow copy for safety.
    console.log(`[Analytics] ${name}`, payload ? { ...payload } : {});
  }
};
