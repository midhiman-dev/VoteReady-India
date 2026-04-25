# VoteReady India

**Ask. Understand. Be vote-ready.**

VoteReady India is an interactive civic education assistant that helps young Indians understand how elections work, what applies to their situation, and what to do next through simple, source-backed guidance.

## Core product direction
- conversational election guide
- adaptive explanation modes
- “what applies to me?” journeys
- election basics explained
- official source cards
- timelines and key procedures guidance
- multilingual and plain-language support

## Tech direction
- React + TypeScript + PWA
- Firebase Auth
- Firestore
- Cloud Run
- Gemini
- Cloud Storage
- Firebase Cloud Messaging
- Firebase Analytics
- Firebase App Check

## Repo structure
- `skills.md` — repo-level build rules for Antigravity
- `agents.md` — role-based agent responsibilities
- `.ai/templates/task-brief.md` — task template for Antigravity
- `apps/web` — frontend app
- `services/api` — Cloud Run backend
- `packages/shared` — shared types/utilities
- `docs/architecture` — architecture notes
- `docs/sources` — official source registry
- `docs/testing` — demo and validation notes

## Build discipline
- one task at a time
- no unrelated file changes
- verify before commit
- keep the repo runnable
- optimize for challenge scoring: alignment, Google services, quality, security, testing, efficiency, accessibility