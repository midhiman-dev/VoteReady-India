# VoteReady India — UI Design Guidance v1 Refined

## Design Intent

VoteReady India should feel like a trusted digital guide for young Indian voters.

The UI should be:
- assistant-first
- mobile-first
- calm and trustworthy
- simple and youth-friendly
- official-source-aware
- politically neutral
- easy to understand for first-time voters

## Core Screens

### P0 Screens

1. Assistant Home
2. Chat / Answer Experience
3. Guided Journeys
4. Guided Journey Detail
5. Election Basics
6. Timeline and Procedures
7. Source Verification Detail
8. Saved Guidance
9. Language / Explanation Settings

### P1 Screens

1. Reminder Preferences
2. Myth vs Fact
3. Admin Source Registry

## Navigation

Use a mobile-first bottom navigation:

1. Ask
2. Journeys
3. Basics
4. Saved
5. Settings

Admin/source registry should not appear in normal user navigation.

## Core UI Patterns

### Assistant-first home

The home screen should make the main action obvious:

> Ask anything about voting in India.

The tagline must remain visible:

> Ask. Understand. Be vote-ready.

### Explanation modes

Use the same three modes everywhere:

- Quick
- Simple
- Detailed

These should appear consistently on assistant answers, basics explanations, and guided journey answers.

### Source cards

Every procedural or deadline-sensitive answer should include a source/freshness block:

- Source title
- Source type
- Jurisdiction
- Last verified
- Freshness status
- Action to view official source

Freshness states:

- Verified
- Review due
- Stale
- Unverified

Do not rely on color only. Use icon + label + short text.

### Trust and safety states

The UI must support:

- loading answer
- verified answer
- review due
- stale source
- unverified answer
- cannot verify from approved sources
- offline / weak network
- empty saved guidance
- politically neutral refusal

### Multilingual support

The UI should visibly support:

- English
- Simple English
- Hinglish
- Hindi

At least one user-facing answer state should demonstrate Hinglish or Hindi.

## Implementation Guidance

Antigravity should use these screens for layout, visual hierarchy, navigation, component structure, and state treatment.

Antigravity must not copy unsafe placeholder content directly.

The actual implemented app should use source-backed response data from the Cloud Run assistant flow.