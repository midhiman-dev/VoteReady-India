import { describe, it, expect } from 'vitest';
import { getGeminiConfig, assertGeminiReady } from './gemini.js';

describe('Gemini Configuration', () => {
  it('Defaults to disabled when env vars are absent', () => {
    const config = getGeminiConfig({});
    expect(config.enabled).toBe(false);
    expect(config.apiKeyPresent).toBe(false);
  });

  it('Reads enabled state correctly', () => {
    const configEnabled = getGeminiConfig({ GEMINI_ENABLED: 'true' });
    expect(configEnabled.enabled).toBe(true);

    const configDisabled = getGeminiConfig({ GEMINI_ENABLED: 'false' });
    expect(configDisabled.enabled).toBe(false);
  });

  it('Detects API key presence without exposing the key', () => {
    const configWithKey = getGeminiConfig({ GEMINI_API_KEY: 'secret-api-key' });
    expect(configWithKey.apiKeyPresent).toBe(true);
    // Ensure actual key is not part of config properties
    expect(Object.values(configWithKey)).not.toContain('secret-api-key');

    const configWithoutKey = getGeminiConfig({ GEMINI_API_KEY: '' });
    expect(configWithoutKey.apiKeyPresent).toBe(false);
  });

  it('Uses default model when model env var is absent', () => {
    const config = getGeminiConfig({});
    expect(config.model).toBe('gemini-1.5-flash');
  });

  it('Uses default timeout when timeout env var is absent', () => {
    const config = getGeminiConfig({});
    expect(config.timeoutMs).toBe(15000);
  });

  it('Parses valid timeout', () => {
    const config = getGeminiConfig({ GEMINI_TIMEOUT_MS: '25000' });
    expect(config.timeoutMs).toBe(25000);
  });

  it('Falls back safely for invalid timeout', () => {
    const configInvalid = getGeminiConfig({ GEMINI_TIMEOUT_MS: 'abc' });
    expect(configInvalid.timeoutMs).toBe(15000);

    const configNegative = getGeminiConfig({ GEMINI_TIMEOUT_MS: '-5000' });
    expect(configNegative.timeoutMs).toBe(15000);
    
    const configZero = getGeminiConfig({ GEMINI_TIMEOUT_MS: '0' });
    expect(configZero.timeoutMs).toBe(15000);
  });

  it('Throws safe error when Gemini is enabled but key is missing', () => {
    const config = getGeminiConfig({ GEMINI_ENABLED: 'true' });
    expect(() => assertGeminiReady(config)).toThrowError(
      'Gemini is enabled but GEMINI_API_KEY is not configured.'
    );
  });

  it('Does not throw when Gemini is disabled', () => {
    const config = getGeminiConfig({ GEMINI_ENABLED: 'false' });
    expect(() => assertGeminiReady(config)).not.toThrow();

    const configEmpty = getGeminiConfig({});
    expect(() => assertGeminiReady(configEmpty)).not.toThrow();
  });
});
