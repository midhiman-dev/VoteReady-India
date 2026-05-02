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
    expect(response.status).toBe('answered');
    expect(response.sources.length).toBeGreaterThan(0);
    for (const source of response.sources) {
      expect(source.freshnessStatus).not.toBe('verified');
    }
    expect(response.freshnessSummary?.status).toBe('review_due');
    expect(response.generatedAt).toBeDefined();

    // Check for safe shell messaging
    const fullAnswerText = response.answerBlocks.map((b) => b.content).join(' ');
    expect(fullAnswerText).toContain('is connected');
    expect(fullAnswerText).toContain('real election guidance yet');
    
    // Check that curated demo fragment context is used
    expect(fullAnswerText).toContain('demo sources include');

    // Check that it does not include procedural guidance terms
    const forbiddenTerms = [
      'deadline', 
      'Form 6', 
      'eligible', 
      'eligibility', 
      'polling date', 
      'register by', 
      'voter ID required'
    ];
    for (const term of forbiddenTerms) {
      expect(fullAnswerText.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  it('should return cannot_verify for procedural questions', async () => {
    const request: AssistantRequest = {
      question: 'How do I register to vote?',
      language: 'simple_english',
      explanationMode: 'simple',
    };

    const response = await orchestrateAssistantResponse({ request });

    expect(response.status).toBe('cannot_verify');
    expect(response.answerBlocks.length).toBe(1);
    expect(response.answerBlocks[0].content).toContain('cannot verify real guidance');
    expect(response.sources.length).toBeGreaterThan(0);
  });

  it('should return out_of_scope for political recommendation questions', async () => {
    const request: AssistantRequest = {
      question: 'Which party should I vote for?',
      language: 'simple_english',
      explanationMode: 'simple',
    };

    const response = await orchestrateAssistantResponse({ request });

    expect(response.status).toBe('out_of_scope');
    expect(response.answerBlocks.length).toBe(1);
    expect(response.answerBlocks[0].content).toContain('cannot recommend a candidate');
    // Sources should be empty for political refusal
    expect(response.sources.length).toBe(0);
  });

  it('should return a shorter response for quick mode (safe shell)', async () => {
    const request: AssistantRequest = {
      question: 'Can VoteReady India answer questions yet?',
      language: 'simple_english',
      explanationMode: 'quick',
    };

    const response = await orchestrateAssistantResponse({ request });

    expect(response.status).toBe('answered');
    expect(response.explanationMode).toBe('quick');
    expect(response.answerBlocks.length).toBe(1);
    expect(response.answerBlocks[0].type).toBe('short_answer');
    
    const fullAnswerText = response.answerBlocks.map((b) => b.content).join(' ');
    expect(fullAnswerText).toContain('is connected');
    expect(fullAnswerText).toContain('cannot give current election guidance yet');
    expect(fullAnswerText).not.toContain('demo sources include');
  });

  it('should return multiple structured blocks for detailed mode (safe shell)', async () => {
    const request: AssistantRequest = {
      question: 'Can VoteReady India answer questions yet?',
      language: 'simple_english',
      explanationMode: 'detailed',
    };

    const response = await orchestrateAssistantResponse({ request });

    expect(response.status).toBe('answered');
    expect(response.explanationMode).toBe('detailed');
    expect(response.answerBlocks.length).toBe(4);
    
    const types = response.answerBlocks.map(b => b.type);
    expect(types).toContain('short_answer');
    expect(types).toContain('source_note');
    expect(types).toContain('what_this_means');
    expect(types).toContain('next_steps');

    const fullAnswerText = response.answerBlocks.map((b) => b.content).join(' ');
    expect(fullAnswerText).toContain('Status:');
    expect(fullAnswerText).toContain('Sources:');
    expect(fullAnswerText).toContain('What this means:');
    expect(fullAnswerText).toContain('Next steps:');
  });
});
