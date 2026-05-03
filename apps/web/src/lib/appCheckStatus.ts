/**
 * Safe App Check status helper for VoteReady India.
 * Following Task 032: Establish a configuration shell without activating enforcement.
 */

export type AppCheckProvider = 'disabled' | 'recaptcha_enterprise_shell' | 'debug_shell';

export interface AppCheckStatus {
  enabled: boolean;
  configured: boolean;
  provider: AppCheckProvider;
  enforcementActive: false; // Always false in Task 032
  message: string;
}

/**
 * Returns the current state of App Check configuration.
 * Site keys are NEVER returned in the status object for security.
 */
export const getAppCheckStatus = (
  env: Record<string, string | undefined> = (import.meta as any).env
): AppCheckStatus => {
  const enabled = env.VITE_APP_CHECK_ENABLED === 'true';
  const providerRaw = env.VITE_APP_CHECK_PROVIDER || 'disabled';
  const siteKey = env.VITE_APP_CHECK_RECAPTCHA_SITE_KEY;

  // Safe provider mapping
  let provider: AppCheckProvider = 'disabled';
  if (providerRaw === 'recaptcha_enterprise_shell') provider = 'recaptcha_enterprise_shell';
  if (providerRaw === 'debug_shell') provider = 'debug_shell';

  const configured = enabled && (provider !== 'disabled') && !!siteKey;

  let message = 'App Check: Not active yet';
  if (enabled && configured) {
    message = `App Check shell configured (${provider}), enforcement not active.`;
  } else if (enabled && !configured) {
    message = 'App Check enabled but incomplete configuration.';
  }

  return {
    enabled,
    configured,
    provider,
    enforcementActive: false, // Strict boundary for Task 032
    message
  };
};
