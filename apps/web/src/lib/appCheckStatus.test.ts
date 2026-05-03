import { describe, it, expect } from 'vitest';
import { getAppCheckStatus } from './appCheckStatus';

describe('appCheckStatus helper', () => {
  it('is disabled by default when env vars are missing or false', () => {
    const status = getAppCheckStatus({});
    expect(status.enabled).toBe(false);
    expect(status.enforcementActive).toBe(false);
    expect(status.message).toBe('App Check: Not active yet');
  });

  it('identifies as enabled but not configured if site key is missing', () => {
    const env = {
      VITE_APP_CHECK_ENABLED: 'true',
      VITE_APP_CHECK_PROVIDER: 'recaptcha_enterprise_shell',
      VITE_APP_CHECK_RECAPTCHA_SITE_KEY: ''
    };

    const status = getAppCheckStatus(env);
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(false);
    expect(status.message).toContain('incomplete configuration');
  });

  it('identifies as configured but non-enforcing when site key is present', () => {
    const env = {
      VITE_APP_CHECK_ENABLED: 'true',
      VITE_APP_CHECK_PROVIDER: 'recaptcha_enterprise_shell',
      VITE_APP_CHECK_RECAPTCHA_SITE_KEY: 'mock-site-key'
    };

    const status = getAppCheckStatus(env);
    expect(status.enabled).toBe(true);
    expect(status.configured).toBe(true);
    expect(status.enforcementActive).toBe(false); // Strict Task 032 requirement
    expect(status.message).toContain('shell configured');
  });

  it('falls back to disabled if provider is unknown', () => {
    const env = {
      VITE_APP_CHECK_ENABLED: 'true',
      VITE_APP_CHECK_PROVIDER: 'malicious_provider',
      VITE_APP_CHECK_RECAPTCHA_SITE_KEY: 'mock-key'
    };

    const status = getAppCheckStatus(env);
    expect(status.provider).toBe('disabled');
    expect(status.configured).toBe(false);
  });

  it('never exposes the raw site key in the status object', () => {
    const rawKey = 'sensitive-recaptcha-key';
    const env = {
      VITE_APP_CHECK_ENABLED: 'true',
      VITE_APP_CHECK_PROVIDER: 'recaptcha_enterprise_shell',
      VITE_APP_CHECK_RECAPTCHA_SITE_KEY: rawKey
    };

    const status = getAppCheckStatus(env) as any;
    expect(JSON.stringify(status)).not.toContain(rawKey);
    expect(status.siteKey).toBeUndefined();
  });
});
