import { describe, it, expect } from 'vitest';
import { orchestrateAssistantResponse } from './orchestrator.js';
import { AssistantRequest } from '@voteready/shared';

describe('orchestrateAssistantResponse', () => {
  it('should return an AssistantResponse matching the request', async () => {
    const request: AssistantRequest = {
      question: 'Can VoteReady India answer questions yet?',
      language: 'simple_english',
      explanationMode: 'simple',
    };

    const response = await orchestrateAssistantResponse({ request });

    expect(response).toBeDefined();
    expect(response.id).toBeDefined();
    expect(response.language).toBe(request.language);
    expect(response.explanationMode).toBe(request.explanationMode);
    expect(response.status).toBe('cannot_verify');
    expect(response.sources).toEqual([]);
    expect(response.freshnessSummary?.status).toBe('review_due');
    expect(response.generatedAt).toBeDefined();

    // Check for safe shell messaging
    const fullAnswerText = response.answerBlocks.map((b) => b.content).join(' ');
    expect(fullAnswerText).toContain('endpoint is connected');
    expect(fullAnswerText).toContain('source-backed election guidance is not active');

    // Check that it does not include procedural guidance terms
    const forbiddenTerms = ['deadline', 'eligibility', 'polling date', 'Form 6'];
    for (const term of forbiddenTerms) {
      expect(fullAnswerText.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});
