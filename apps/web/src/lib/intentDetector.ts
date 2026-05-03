/**
 * intentDetector.ts
 *
 * Lightweight, deterministic keyword-based intent classifier.
 * Used purely on the frontend to shape UX framing.
 *
 * Rules:
 * - No ML, no external APIs
 * - All logic is local and testable
 * - Returns an intent label + supporting UX copy
 * - Never generates election guidance itself
 */

export type AssistantIntent =
  | 'AGE_INTENT'
  | 'REGISTRATION_INTENT'
  | 'VOTER_ID_INTENT'
  | 'POLLING_INTENT'
  | 'STATUS_INTENT'
  | 'GENERIC_INTENT';

export interface IntentResult {
  intent: AssistantIntent;
  /** Short label shown in input hint area */
  hintLabel: string;
  /** Contextual "What this means" framing text (safe, non-procedural) */
  contextFraming: string;
  /** Suggested follow-up question chips (2–3) */
  followUpChips: string[];
  /** Optional preamble shown above sources when intent is strong */
  sourceFraming: string | null;
}

// ─── Keyword patterns per intent ─────────────────────────────────────────────

const AGE_PATTERNS = [
  /\b18\b/i,
  /turning\s+18/i,
  /eligible/i,
  /eligibility/i,
  /age\s+limit/i,
  /minimum\s+age/i,
  /how\s+old/i,
  /old\s+enough/i,
];

const REGISTRATION_PATTERNS = [
  /register/i,
  /registration/i,
  /enroll/i,
  /voter\s+list/i,
  /voter\s+roll/i,
  /electoral\s+roll/i,
  /form\s+6/i,
  /add\s+name/i,
  // Note: voter_id and epic are NOT here — informational voter ID queries
  // are caught by VOTER_ID_INTENT first; only apply/get/register for ID
  // falls through to this block.
];

/**
 * VOTER_ID_INTENT — informational queries about what the voter ID card IS.
 * These are "explain/define" questions, not registration actions.
 * Evaluated before REGISTRATION to avoid false classification.
 */
const VOTER_ID_PATTERNS = [
  /what\s+is\s+(a\s+|the\s+)?voter\s+id/i,
  /what\s+is\s+(a\s+|the\s+)?epic/i,
  /what\s+is\s+(a\s+|the\s+)?electoral\s+photo/i,
  /tell\s+me\s+about\s+(the\s+|a\s+)?voter\s+id/i,
  /explain\s+(the\s+|a\s+)?voter\s+id/i,
  /voter\s+id\s+card/i,
  /epic\s+card/i,
  /elector'?s?\s+(photo\s+)?id/i,
];

const POLLING_PATTERNS = [
  /polling\s+day/i,
  /polling\s+station/i,
  /how\s+to\s+vote/i,
  /cast\s+vote/i,
  /cast\s+my\s+vote/i,
  /voting\s+day/i,
  /booth/i,
  /ballot/i,
  /evm/i,
];

const STATUS_PATTERNS = [
  /name\s+missing/i,
  /check\s+status/i,
  /my\s+name\s+not/i,
  /deleted/i,
  /removed\s+from/i,
  /voter\s+status/i,
  /nvsp/i,
  /find\s+my\s+name/i,
];

// ─── Classifier ───────────────────────────────────────────────────────────────

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(text));
}

export function detectIntent(question: string): IntentResult {
  const q = question.trim();

  if (matchesAny(q, AGE_PATTERNS)) {
    return {
      intent: 'AGE_INTENT',
      hintLabel: 'Looks like you\'re asking about eligibility.',
      contextFraming:
        'Since you\'re approaching or just reaching voting age, this usually means you\'ll need to check eligibility and registration requirements before the next election.',
      followUpChips: [
        'How do I register to vote?',
        'What documents are needed to register?',
        'What happens on polling day?',
      ],
      sourceFraming: null,
    };
  }

  // STATUS before REGISTRATION — status questions often contain "voter list" or "register" words
  if (matchesAny(q, STATUS_PATTERNS)) {
    return {
      intent: 'STATUS_INTENT',
      hintLabel: 'Looks like you\'re checking your voter status.',
      contextFraming:
        'Voter status issues — like a missing or deleted name — can often be resolved through the NVSP portal or at your local Electoral Registration Office.',
      followUpChips: [
        'How do I check if my name is on the voter list?',
        'How do I add my name to the voter list?',
        'Who do I contact if my name is missing?',
      ],
      sourceFraming:
        'These sources can help you verify and resolve your voter status.',
    };
  }

  if (matchesAny(q, REGISTRATION_PATTERNS)) {
    return {
      intent: 'REGISTRATION_INTENT',
      hintLabel: 'This sounds like a registration question.',
      contextFraming:
        'This typically relates to getting your name onto the electoral roll before you can vote. Verified sources will have the exact steps.',
      followUpChips: [
        'What documents do I need to register?',
        'How do I check if my name is on the voter list?',
        'What is the deadline to register?',
      ],
      sourceFraming:
        'These official sources are where verified registration instructions will come from once connected.',
    };
  }

  // VOTER_ID — informational queries about what the voter ID card is
  // Evaluated after REGISTRATION so that "how do I get a voter ID" (register intent)
  // takes priority over "what is a voter ID card" (voter ID intent) only when
  // both patterns might match. In practice the VOTER_ID_PATTERNS are specific
  // enough that they won't overlap with REGISTRATION_PATTERNS.
  if (matchesAny(q, VOTER_ID_PATTERNS)) {
    return {
      intent: 'VOTER_ID_INTENT',
      hintLabel: 'Looks like you\'re asking about the voter ID card.',
      contextFraming:
        'The Voter ID card (EPIC — Elector\'s Photo Identity Card) is issued by the Election Commission of India and serves as proof of identity for voting.',
      followUpChips: [
        'How do I apply for a voter ID card?',
        'What documents are needed to register?',
        'How do I check if my name is on the voter list?',
      ],
      sourceFraming:
        'Official ECI sources have the latest information about the voter ID card and how to obtain one.',
    };
  }

  if (matchesAny(q, POLLING_PATTERNS)) {
    return {
      intent: 'POLLING_INTENT',
      hintLabel: 'This looks like a question about voting on polling day.',
      contextFraming:
        'On polling day, voters go to their assigned polling station to cast their vote. The process is managed by the Election Commission of India.',
      followUpChips: [
        'How do I find my polling station?',
        'What ID do I need to bring on polling day?',
        'What is the EVM (Electronic Voting Machine)?',
      ],
      sourceFraming:
        'The official ECI website has the most up-to-date polling day information.',
    };
  }

  // Fallback
  return {
    intent: 'GENERIC_INTENT',
    hintLabel: '',
    contextFraming: '',
    followUpChips: [
      'How do I register to vote?',
      'What happens on polling day?',
      'I am turning 18. What should I do?',
    ],
    sourceFraming: null,
  };
}
