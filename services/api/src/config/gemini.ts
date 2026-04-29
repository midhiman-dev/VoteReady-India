export interface GeminiConfig {
  enabled: boolean;
  apiKeyPresent: boolean;
  model: string;
  timeoutMs: number;
}

export function getGeminiConfig(env?: NodeJS.ProcessEnv): GeminiConfig {
  const finalEnv = env || process.env;
  const enabled = finalEnv.GEMINI_ENABLED === 'true';
  const apiKeyPresent = !!finalEnv.GEMINI_API_KEY && finalEnv.GEMINI_API_KEY.trim().length > 0;
  const model = finalEnv.GEMINI_MODEL || 'gemini-1.5-flash';
  
  let timeoutMs = 15000;
  if (finalEnv.GEMINI_TIMEOUT_MS) {
    const parsed = parseInt(finalEnv.GEMINI_TIMEOUT_MS, 10);
    if (!isNaN(parsed) && parsed > 0) {
      timeoutMs = parsed;
    }
  }

  return {
    enabled,
    apiKeyPresent,
    model,
    timeoutMs,
  };
}

export function assertGeminiReady(config: GeminiConfig): void {
  if (config.enabled && !config.apiKeyPresent) {
    throw new Error('Gemini is enabled but GEMINI_API_KEY is not configured.');
  }
}
