# VoteReady India Demo Checklist

## Document Metadata

| Field | Value |
|---|---|
| Document Title | VoteReady India Demo Checklist |
| Product | VoteReady India |
| Tagline | Ask. Understand. Be vote-ready. |
| Version | v1.0 |
| Status | Draft |
| Date | 2026-04-25 |
| Owner | QA & Review Agent / Product Owner / Demo Owner |
| Related Documents | `README.md`, `skills.md`, `agents.md`, `docs/architecture/architecture-overview.md`, `docs/sources/source-registry.md` |

---

## 1. Purpose

This checklist defines the minimum demo and validation standard for VoteReady India before any PromptWars submission attempt.

It exists to ensure the build is:

- aligned to the challenge problem statement
- visibly using required Google services
- safe, truthful, and source-backed
- stable enough for demo and judging
- ready for final submission and later manual review

---

## 2. Demo Readiness Gate

A submission should be considered demo-ready only if all of the following are true:

- the app works as an **interactive civic education assistant**
- the assistant can explain elections in India conversationally
- at least one **Cloud Run-backed** assistant flow is working end to end
- important procedural answers show **source cards**
- the product clearly supports **different explanation depths**
- at least one **guided journey** works
- the build is stable enough to demo without manual patching
- no unsupported claims are shown as official truth
- core flows pass manual validation
- the product is aligned to the challenge, not drifting into unrelated features

---

## 3. Challenge Alignment Checklist

## 3.1 Problem Statement Alignment

Confirm the product clearly does all of the following:

- [ ] helps users understand the election process in India
- [ ] explains timelines and key procedures
- [ ] explains how the voting system works in a digestible way
- [ ] feels conversational, not like a static textbook
- [ ] can handle diverse user questions
- [ ] adapts explanations to different user knowledge levels
- [ ] remains focused on civic education, not political persuasion
- [ ] shows a clear user value for Gen-Z, first-time voters, and soon-to-be voters

## 3.2 Product Positioning Check

- [ ] the product is clearly presented as an **interactive civic education assistant**
- [ ] the assistant is the primary experience
- [ ] reminders, saved guidance, and timeline views act as support features, not the main product
- [ ] the product is not presented as an ECI clone
- [ ] the product is not presented as a generic chatbot

---

## 4. Google Services Checklist

## 4.1 Mandatory Usage Check

- [ ] Antigravity was actually used as the build workflow
- [ ] Cloud Run powers a real product path
- [ ] Gemini powers explanation/simplification in the assistant flow
- [ ] Firestore stores structured app or source data
- [ ] Firebase Auth is used if saved guidance or user-specific flows exist
- [ ] Analytics is integrated for challenge evidence
- [ ] App Check is enabled where practical
- [ ] FCM is only included if it works cleanly and supports a real reminder flow

## 4.2 Cloud Run Validation

- [ ] there is at least one real backend endpoint on Cloud Run
- [ ] the assistant request flows through Cloud Run
- [ ] Cloud Run is not just a dummy proxy
- [ ] Cloud Run performs meaningful logic such as source retrieval, grounding, orchestration, or response shaping
- [ ] protected operations are validated server-side

## 4.3 Google Services Demo Proof

- [ ] demo can clearly show where Cloud Run is used
- [ ] demo can clearly show where Gemini is used
- [ ] demo can clearly show where Firestore is used
- [ ] demo can clearly show where Analytics is used
- [ ] demo explanation can mention Google services truthfully and specifically

---

## 5. Core Product Flow Checklist

## 5.1 Conversational Election Guide

Test these prompts:

- [ ] “How does voting work in India?”
- [ ] “Explain it simply.”
- [ ] “Give me the short version.”
- [ ] “Tell me step by step.”

Expected result:

- [ ] answer is conversational
- [ ] answer is understandable
- [ ] answer is structured
- [ ] answer is relevant to India
- [ ] answer is not textbook-like
- [ ] answer includes source support when appropriate

## 5.2 Guided Journeys

Test at least these scenarios:

- [ ] first-time voter
- [ ] turning 18 soon
- [ ] moved recently
- [ ] polling-day help
- [ ] name missing from voter list

Expected result:

- [ ] guidance is relevant to the scenario
- [ ] explanation is easy to follow
- [ ] next steps are clear
- [ ] source-backed references appear where needed

## 5.3 Election Basics Explained

Test these concept prompts:

- [ ] “What is the difference between Lok Sabha and Vidhan Sabha?”
- [ ] “What is an electoral roll?”
- [ ] “What is a constituency?”
- [ ] “Why do I need to check my name on the voter list?”

Expected result:

- [ ] the assistant explains civic concepts clearly
- [ ] the assistant does not overcomplicate
- [ ] the assistant can switch depth if requested

## 5.4 Source Cards

For important procedural answers, confirm:

- [ ] source title is shown
- [ ] source type is shown
- [ ] jurisdiction is shown where relevant
- [ ] freshness or last verified state is shown
- [ ] the app does not present unsupported claims as official facts

## 5.5 Plain-Language / Multilingual Support

Test at least one of the following:

- [ ] plain English mode
- [ ] Hindi mode
- [ ] Hinglish mode

Expected result:

- [ ] meaning stays accurate
- [ ] language becomes easier, not noisier
- [ ] official meaning is preserved

---

## 6. Save and Reminder Flow Checklist

## 6.1 Save Guidance

- [ ] user can save a useful answer or journey
- [ ] saved item is retrievable later
- [ ] saved state is tied to the correct user identity if auth is enabled
- [ ] save flow does not break the core assistant experience

## 6.2 Reminder Flow

Only validate if reminders are implemented.

- [ ] user can enable a reminder
- [ ] reminder preference is stored correctly
- [ ] reminder flow has a real backend/data path
- [ ] reminder copy is relevant and non-spammy
- [ ] reminder feature is not included unless it is demoable

---

## 7. Source Trust and Freshness Checklist

## 7.1 Trust Rules

- [ ] procedural answers come from approved official sources
- [ ] unofficial summaries are not shown as primary authority
- [ ] answer generation does not rely on unsupported memory alone
- [ ] no undocumented API claims are presented as facts

## 7.2 Freshness Handling

- [ ] verified content displays cleanly
- [ ] stale content is marked clearly
- [ ] unverified content is not presented as authoritative
- [ ] the assistant can say “this could not be verified” when needed
- [ ] redirection to official sources works where appropriate

---

## 8. Testing Checklist by Scoring Dimension

## 8.1 Code Quality

- [ ] project structure is understandable
- [ ] frontend, backend, and shared code are separated logically
- [ ] no obvious dead code or placeholder clutter remains
- [ ] naming is clear
- [ ] files are not unreasonably bloated
- [ ] README and docs reflect the actual app

## 8.2 Security

- [ ] no secrets are committed
- [ ] `.env` files are excluded
- [ ] protected backend actions require validation
- [ ] admin-only or source-refresh operations are protected
- [ ] user state changes are authenticated where appropriate
- [ ] client input is treated as untrusted

## 8.3 Efficiency

- [ ] app loads reasonably fast
- [ ] large raw source payloads are not sent directly to the client unnecessarily
- [ ] Firestore reads are bounded and not wasteful
- [ ] Cloud Run is doing meaningful orchestration, not unnecessary proxying
- [ ] secondary views are lazy-loaded if appropriate

## 8.4 Testing

- [ ] core helper logic has unit tests where practical
- [ ] Cloud Run + Firestore flow has at least basic integration coverage
- [ ] manual test evidence exists for challenge-critical journeys
- [ ] stale/unverified answer handling is tested
- [ ] guided journey flow is tested
- [ ] source card rendering is tested

## 8.5 Accessibility

- [ ] color is not the only way state is communicated
- [ ] keyboard navigation works for core flows
- [ ] headings and structure are clear
- [ ] text contrast is strong
- [ ] answer cards are readable on mobile
- [ ] source and freshness labels are visible and understandable
- [ ] plain-language mode is discoverable if implemented

---

## 9. Manual Demo Script Validation

The following demo sequence should work without failure.

### Demo Step 1 — Election basics
- [ ] ask: “How does voting work in India?”
- [ ] show conversational answer
- [ ] show source-backed support
- [ ] switch to short/simple mode

### Demo Step 2 — Personalized scenario
- [ ] choose: “I’m turning 18 soon”
- [ ] show guided journey
- [ ] show what applies to the user
- [ ] show next steps

### Demo Step 3 — Civic concept explainer
- [ ] ask: “Explain Lok Sabha vs Vidhan Sabha simply”
- [ ] confirm the answer is digestible and accurate

### Demo Step 4 — Save guidance
- [ ] save one answer or journey
- [ ] retrieve it successfully

### Demo Step 5 — Trust and freshness
- [ ] open a source-backed answer
- [ ] confirm source name and freshness are visible

### Demo Step 6 — Google services proof
- [ ] demonstrate Cloud Run-backed answer path
- [ ] demonstrate Gemini-backed explanation path
- [ ] demonstrate Firestore-backed state or content path
- [ ] confirm Analytics event logging exists

---

## 10. Negative / Edge Case Checklist

The app should also fail safely.

- [ ] if a source cannot be verified, the assistant says so clearly
- [ ] if a question is out of scope, the assistant responds safely
- [ ] if a user asks for something unsupported, the app does not hallucinate an official process
- [ ] if a backend request fails, the UI shows a clear error state
- [ ] if a reminder feature is incomplete, it is hidden or disabled cleanly
- [ ] if a language switch is unsupported for a specific answer, the app falls back gracefully

---

## 11. Submission Attempt Strategy

PromptWars counts the **final submission only**, not the best earlier score.

### Recommended strategy

#### Attempt 1 — Diagnostic
- [ ] submit only after the core app is stable enough to get a meaningful score
- [ ] use this attempt to identify weak scoring categories
- [ ] do not treat this as the final polished attempt

#### Attempt 2 — Improvement
- [ ] address the weakest scoring category first
- [ ] improve problem alignment and Google services visibility
- [ ] strengthen testing and accessibility if needed

#### Attempt 3 — Final Release Candidate
- [ ] use only after all release-candidate checks pass
- [ ] verify docs, demo, and claims are truthful
- [ ] verify the LinkedIn narrative matches the real build
- [ ] verify no placeholder or hallucinated claims remain

### Final submission rule

- [ ] do not use the final attempt until this checklist is materially complete

---

## 12. Manual Review / LinkedIn Evidence Checklist

The organizers may manually review the build after automated scoring.

### Product truthfulness

- [ ] product claims match what is actually built
- [ ] Google services claims match real implementation
- [ ] no fake integrations are claimed
- [ ] no unsupported civic/legal claims are made

### LinkedIn / documentation truthfulness

- [ ] LinkedIn post does not exaggerate functionality
- [ ] screenshots match the actual app
- [ ] feature list matches the real build
- [ ] architecture summary matches the real code
- [ ] manual reviewer could trace key claims to visible behavior

### Evidence pack readiness

- [ ] README is current
- [ ] architecture overview is current
- [ ] source registry is current
- [ ] demo checklist is current
- [ ] final screenshots or short demo notes are ready if needed

---

## 13. Release Candidate Sign-Off

A release candidate is ready only when all below are true:

- [ ] challenge alignment is strong
- [ ] Cloud Run is meaningfully used
- [ ] Gemini is meaningfully used
- [ ] core assistant flow works reliably
- [ ] source-backed answers work
- [ ] guided journeys work
- [ ] testing is adequate for the challenge stage
- [ ] accessibility basics are covered
- [ ] documentation is truthful
- [ ] the app is stable enough for the final submission

---

## 14. Summary

This checklist exists to protect the final score.

VoteReady India should not be submitted as “done” unless it is:

- aligned to the civic education challenge
- clearly powered by real Google services
- source-backed and freshness-aware
- secure and accessible enough to be credible
- truthful enough to survive manual review
- stable enough for the final attempt to count