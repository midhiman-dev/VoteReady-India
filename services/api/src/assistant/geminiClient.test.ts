import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGemini } from './geminiClient.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

vi.mock("@google/generative-ai", () => {
  const generateContent = vi.fn();
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockImplementation(() => ({
        generateContent,
      })),
    })),
  };
});

describe('geminiClient', () => {
  const mockConfig = {
    enabled: true,
    apiKeyPresent: true,
    model: 'gemini-1.5-flash',
    timeoutMs: 1000,
  };

  const mockParams = {
    question: 'How do I vote?',
    sources: [],
    fragments: [],
    language: 'english' as const,
    explanationMode: 'simple' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should call Gemini and return text on success', async () => {
    const mockResponse = {
      response: {
        text: () => 'You vote at a polling station.',
      },
    };
    const { GoogleGenerativeAI: MockGAI } = await import("@google/generative-ai");
    const mockModel = new (MockGAI as any)().getGenerativeModel();
    vi.mocked(mockModel.generateContent).mockResolvedValue(mockResponse);

    const result = await callGemini(mockParams, mockConfig);

    expect(result).toBe('You vote at a polling station.');
    expect(mockModel.generateContent).toHaveBeenCalled();
  });

  it('should throw error if Gemini is disabled', async () => {
    await expect(callGemini(mockParams, { ...mockConfig, enabled: false }))
      .rejects.toThrow('Gemini is not configured or disabled.');
  });

  it('should throw error on empty response', async () => {
    const mockResponse = {
      response: {
        text: () => '',
      },
    };
    const { GoogleGenerativeAI: MockGAI } = await import("@google/generative-ai");
    const mockModel = new (MockGAI as any)().getGenerativeModel();
    vi.mocked(mockModel.generateContent).mockResolvedValue(mockResponse);

    await expect(callGemini(mockParams, mockConfig))
      .rejects.toThrow('Gemini returned an empty response.');
  });

  it('should handle timeout correctly', async () => {
    const { GoogleGenerativeAI: MockGAI } = await import("@google/generative-ai");
    const mockModel = new (MockGAI as any)().getGenerativeModel();
    
    // Simulate a timeout by never resolving
    vi.mocked(mockModel.generateContent).mockImplementation(() => {
      return new Promise((_, reject) => {
        const error = new Error('deadline-exceeded');
        (error as any).name = 'AbortError';
        setTimeout(() => reject(error), 100);
      });
    });

    const fastConfig = { ...mockConfig, timeoutMs: 50 };

    await expect(callGemini(mockParams, fastConfig))
      .rejects.toThrow(/timed out/);
  });
});
