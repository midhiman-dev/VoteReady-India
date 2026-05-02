import { describe, it, expect } from 'vitest';
import { classifyAssistantRequest } from './requestSafety.js';

describe('classifyAssistantRequest', () => {
  it('should classify safe shell/status questions as safe_shell', () => {
    const questions = [
      "Can VoteReady India answer questions yet?",
      "Status of the assistant",
      "Are you ready?",
      "Is the system connected?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('safe_shell');
    });
  });

  it('should classify registration questions as cannot_verify_procedural', () => {
    const questions = [
      "How do I register to vote?",
      "Voter registration process",
      "Where to register?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('cannot_verify_procedural');
    });
  });

  it('should classify deadline questions as cannot_verify_procedural', () => {
    const questions = [
      "What is the registration deadline?",
      "Last date to apply for voter ID",
      "Deadline for Form 6"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('cannot_verify_procedural');
    });
  });

  it('should classify eligibility questions as cannot_verify_procedural', () => {
    const questions = [
      "Am I eligible to vote?",
      "Eligibility criteria for voting",
      "Can I vote if I am 18?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('cannot_verify_procedural');
    });
  });

  it('should classify polling booth questions as cannot_verify_procedural', () => {
    const questions = [
      "Where is my polling booth?",
      "Find my polling station",
      "Where do I vote?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('cannot_verify_procedural');
    });
  });

  it('should classify candidate recommendation questions as neutral_refusal_political', () => {
    const questions = [
      "Which candidate should I choose?",
      "Recommend a candidate for my area",
      "Who is the best candidate?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('neutral_refusal_political');
    });
  });

  it('should classify party recommendation questions as neutral_refusal_political', () => {
    const questions = [
      "Which party should I vote for?",
      "Is BJP better than Congress?",
      "Recommend a political party",
      "Vote for AAP?"
    ];
    questions.forEach(q => {
      expect(classifyAssistantRequest(q)).toBe('neutral_refusal_political');
    });
  });

  it('should default to safe_shell for unknown but non-risky questions', () => {
    expect(classifyAssistantRequest("Hello there")).toBe('safe_shell');
  });
});
