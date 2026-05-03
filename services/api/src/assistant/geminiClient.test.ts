import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGemini, clearModelCache } from './geminiClient.js';

// Shared mock state - must be inside vi.mock factory (no external refs due to hoisting)
vi.mock("@google/generative-ai", () => {
  const generateContent = vi.fn();
  const getGenerativeModel = vi.fn().mockReturnValue({ generateContent });
  return {
    GoogleGenerativeAI: vi.fn().mockReturnValue({ getGenerativeModel }),
    // Expose internals via a helper export for tests
    __mocks: { generateContent, getGenerativeModel },
  };
});

describe('geminiClient', () => {
  const mockConfig = {
    enabled: true,
    apiKeyPresent: true,
    model: 'gemini-2.5-flash',
    timeoutMs: 1000,
  };

  const mockParams = {
    question: 'How do I vote?',
    sources: [],
    fragments: [],
    language: 'english' as const,
    explanationMode: 'simple' as const,
  };

  let MockGAI: any;
  let mockGenerateContent: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Access mocks after hoisting
    const mod = await import("@google/generative-ai") as any;
    MockGAI = mod.GoogleGenerativeAI;
    mockGenerateContent = mod.__mocks.generateContent;

    vi.clearAllMocks();
    clearModelCache();
    process.env.GEMINI_API_KEY = 'test-key';

    // Re-wire mocks after clearAllMocks resets them
    const getGenerativeModel = vi.fn().mockReturnValue({ generateContent: mockGenerateContent });
    vi.mocked(MockGAI).mockReturnValue({ getGenerativeModel });
  });

  it('should call Gemini and return text on success', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'You vote at a polling station.' },
    });

    const result = await callGemini(mockParams, mockConfig);

    expect(result).toBe('You vote at a polling station.');
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should throw error if Gemini is disabled', async () => {
    await expect(callGemini(mockParams, { ...mockConfig, enabled: false }))
      .rejects.toThrow('Gemini is not configured or disabled.');
  });

  it('should throw error on empty response', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => '' },
    });

    await expect(callGemini(mockParams, mockConfig))
      .rejects.toThrow('Gemini returned an empty response.');
  });

  it('should handle timeout correctly', async () => {
    mockGenerateContent.mockImplementation(() =>
      new Promise((_, reject) => {
        const error = new Error('deadline-exceeded');
        (error as any).name = 'AbortError';
        setTimeout(() => reject(error), 100);
      })
    );

    const fastConfig = { ...mockConfig, timeoutMs: 50 };
    await expect(callGemini(mockParams, fastConfig))
      .rejects.toThrow(/timed out/);
  });

  // ─── Singleton / Factory Tests ─────────────────────────────────────────────

  it('should reuse the same model instance across multiple calls (singleton)', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Answer.' },
    });

    await callGemini(mockParams, mockConfig);
    await callGemini(mockParams, mockConfig);

    // GoogleGenerativeAI constructor should only be called once for the same config
    expect(vi.mocked(MockGAI)).toHaveBeenCalledTimes(1);
  });

  it('should create a new model instance when model name changes', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Answer.' },
    });

    const configA = { ...mockConfig, model: 'gemini-2.5-flash' };
    const configB = { ...mockConfig, model: 'gemini-2.5-pro' };

    await callGemini(mockParams, configA);
    await callGemini(mockParams, configB);

    // Two distinct models = two constructor calls
    expect(vi.mocked(MockGAI)).toHaveBeenCalledTimes(2);
  });

  it('should create a new model instance after clearModelCache()', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Answer.' },
    });

    await callGemini(mockParams, mockConfig);
    clearModelCache();
    await callGemini(mockParams, mockConfig);

    expect(vi.mocked(MockGAI)).toHaveBeenCalledTimes(2);
  });

  it('should still fall back gracefully when Gemini throws a non-timeout error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Service unavailable'));

    await expect(callGemini(mockParams, mockConfig))
      .rejects.toThrow('Service unavailable');
  });
});
