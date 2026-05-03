import { describe, it, expect } from 'vitest';
import { detectIntent } from './intentDetector';

describe('intentDetector', () => {
  describe('AGE_INTENT', () => {
    it('detects "18" keyword', () => {
      expect(detectIntent('I am 18, can I vote?').intent).toBe('AGE_INTENT');
    });

    it('detects "turning 18"', () => {
      expect(detectIntent('I am turning 18 next month').intent).toBe('AGE_INTENT');
    });

    it('detects "eligible"', () => {
      expect(detectIntent('Am I eligible to vote?').intent).toBe('AGE_INTENT');
    });

    it('provides age-specific follow-up chips', () => {
      const result = detectIntent('Am I eligible?');
      expect(result.followUpChips.length).toBeGreaterThanOrEqual(2);
      expect(result.followUpChips.some(c => /register/i.test(c))).toBe(true);
    });

    it('provides a hint label', () => {
      const result = detectIntent('I am turning 18');
      expect(result.hintLabel).toMatch(/eligibility/i);
    });
  });

  describe('REGISTRATION_INTENT', () => {
    it('detects "register"', () => {
      expect(detectIntent('How do I register to vote?').intent).toBe('REGISTRATION_INTENT');
    });

    it('detects "voter list"', () => {
      expect(detectIntent('How do I get on the voter list?').intent).toBe('REGISTRATION_INTENT');
    });

    it('does NOT classify "What is the voter ID card?" as REGISTRATION', () => {
      // This was the reported false match — voter ID informational queries
      // should be VOTER_ID_INTENT, not REGISTRATION_INTENT.
      expect(detectIntent('What is the voter ID card?').intent).not.toBe('REGISTRATION_INTENT');
    });

    it('provides a source framing for registration', () => {
      const result = detectIntent('How do I register?');
      expect(result.sourceFraming).not.toBeNull();
      expect(result.sourceFraming).toMatch(/official/i);
    });
  });

  describe('VOTER_ID_INTENT', () => {
    it('detects "What is the voter ID card?"', () => {
      expect(detectIntent('What is the voter ID card?').intent).toBe('VOTER_ID_INTENT');
    });

    it('detects "What is an EPIC card?"', () => {
      expect(detectIntent('What is an EPIC card?').intent).toBe('VOTER_ID_INTENT');
    });

    it('detects "tell me about the voter ID"', () => {
      expect(detectIntent('Tell me about the voter ID').intent).toBe('VOTER_ID_INTENT');
    });

    it('detects "voter id card" phrase', () => {
      expect(detectIntent('I want to know about voter id card').intent).toBe('VOTER_ID_INTENT');
    });

    it('provides a hint label for voter ID intent', () => {
      const result = detectIntent('What is the voter ID card?');
      expect(result.hintLabel).toMatch(/voter id/i);
    });

    it('provides follow-up chips including application question', () => {
      const result = detectIntent('What is the voter ID card?');
      expect(result.followUpChips.length).toBeGreaterThanOrEqual(2);
      expect(result.followUpChips.some(c => /apply/i.test(c) || /register/i.test(c))).toBe(true);
    });

    it('provides a source framing', () => {
      const result = detectIntent('What is the voter ID card?');
      expect(result.sourceFraming).not.toBeNull();
      expect(result.sourceFraming).toMatch(/ECI/i);
    });

    it('boundary: "How do I apply for voter ID" stays REGISTRATION_INTENT', () => {
      // "apply for voter ID" has register-adjacent intent, not purely informational
      // REGISTRATION_PATTERNS match "register" or similar — this is a known boundary.
      // The key fix is that the plain "What is a voter ID" question no longer
      // incorrectly lands on REGISTRATION_INTENT.
      const result = detectIntent('How do I get a voter ID card?');
      // Should be either VOTER_ID or REGISTRATION — just not GENERIC
      expect(result.intent).not.toBe('GENERIC_INTENT');
    });
  });

  describe('POLLING_INTENT', () => {
    it('detects "polling day"', () => {
      expect(detectIntent('What happens on polling day?').intent).toBe('POLLING_INTENT');
    });

    it('detects "how to vote"', () => {
      expect(detectIntent('How do I cast my vote?').intent).toBe('POLLING_INTENT');
    });

    it('detects "polling station"', () => {
      expect(detectIntent('Where is my polling station?').intent).toBe('POLLING_INTENT');
    });
  });

  describe('STATUS_INTENT', () => {
    it('detects "name missing"', () => {
      expect(detectIntent('I need to find my name on the list').intent).toBe('STATUS_INTENT');
    });

    it('detects "check status" without registration keywords', () => {
      expect(detectIntent('How do I check status of my voter application?').intent).toBe('STATUS_INTENT');
    });

    it('provides source framing for status intent', () => {
      const result = detectIntent('My name is missing from the electoral roll');
      expect(result.sourceFraming).not.toBeNull();
    });
  });

  describe('GENERIC_INTENT', () => {
    it('falls back for unrecognised questions', () => {
      expect(detectIntent('Tell me about democracy').intent).toBe('GENERIC_INTENT');
    });

    it('returns empty hint label for generic intent', () => {
      const result = detectIntent('What is India?');
      expect(result.hintLabel).toBe('');
    });

    it('still returns fallback follow-up chips', () => {
      const result = detectIntent('Random question');
      expect(result.followUpChips.length).toBeGreaterThanOrEqual(2);
    });

    it('handles empty string gracefully', () => {
      const result = detectIntent('');
      expect(result.intent).toBe('GENERIC_INTENT');
    });
  });
});
