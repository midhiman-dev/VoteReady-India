# VoteReady India

**Ask. Understand. Be vote-ready.**

VoteReady India is an interactive civic education assistant that helps young Indians understand how elections work, what applies to their situation, and what to do next through simple, source-backed guidance.

### Public Deployed Application
**Public URL**: [https://voteready-india-web-529590785617.asia-south1.run.app](https://voteready-india-web-529590785617.asia-south1.run.app)

> **Disclaimer**: This application is currently in a safe-shell state. It does not provide real procedural election guidance, polling instructions, eligibility rules, or political recommendations. Gemini model calls, real source retrieval, and Firebase integrations are currently disabled by default to preserve strict boundaries.

## Safe-Shell Architecture Summary

The current MVP build focuses on a **Safe Shell Architecture**. All core UI components and API endpoints are established, but generative AI and live election data are intentionally disabled to preserve safety and neutrality during the initial build phase.

### What is Active
- **Assistant Shell**: Multi-language (English, Hindi, Hinglish), multi-mode (Standard, Simple) interface for election readiness questions.
- **Safety Orchestration**: Deterministic routing for procedural and political questions.
- **Source Registry**: Centralized management of official election sources (ECI-first) returning metadata-only safe source cards.
- **Saved Guidance**: Local persistence of assistant responses (`localStorage`).
- **Guided Journeys Shell**: UX framework for scenario-based election guidance (e.g., "Turning 18 soon").
- **Election Basics**: Educational content shell.
- **Accessibility**: Core screens support keyboard navigation and screen readers.

### What is Intentionally Inactive
- **Gemini Model Calls**: Configured but inactive.
- **Source Retrieval/Scraping**: No live scraping.
- **Real Procedural Election Guidance**: Dates, deadlines, form instructions, eligibility rules are not active.
- **Firebase Auth & Firestore Sync**: Platform shells are present but do not connect to a real backend. Data uses `localStorage`.
- **App Check & Analytics**: Configuration exists but is not enforced.
- **Notifications/Reminders**: Preferences save locally, but no real messages are dispatched.

## Local Setup Instructions

### Prerequisites
- Node.js (Latest LTS recommended)
- `npm`

### Environment Setup
1. Copy `.env.example` to `.env` in the root directory.
2. Copy `apps/web/.env.example` to `apps/web/.env`.
3. *(Optional)* Variables related to Gemini, Firebase, App Check, and Analytics are present but do not need to be populated for the app to run in its current safe-shell state.

### Setup
```powershell
npm install
```

## Running Locally

Start the API backend:
```powershell
npm run dev:api
```

Start the Web App:
```powershell
npm run dev:web
```

The web app will be available at `http://localhost:3000`.

## Testing & Verification

Run the full suite of validations (build, typecheck, tests):
```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web
npm test --workspace=@voteready/api
npm test --workspace=@voteready/shared
```

## Demo Flow

The application provides several testable flows representing the safe-shell features:
1. **Load the app** and view the responsive layout.
2. **Submit a question** to the Assistant to see the loading state and simulated response.
3. Test **Cannot-Verify** responses (e.g., "How do I register to vote?") and **Out-of-Scope** refusals (e.g., "Which party should I vote for?").
4. View **Source Cards** (metadata-only) returned with responses.
5. Save guidance and verify it appears in the **Saved Guidance** panel and persists across reloads.
6. Check the **Account & Sync** and **Reminder Preferences** panels to confirm they are in their inactive states.
7. Navigate to the **Guided Journeys** and explore the "Turning 18 soon" shell.
8. Explore the **Election Basics** shell.

## Safety Boundaries

This build actively prevents:
- Gemini model calls
- Real source retrieval and ingestion/scraping
- Verified procedural election guidance, dates, and deadlines
- Eligibility rules and polling instructions
- Political recommendations
- Firebase Auth sign-in and active Firestore sync
- App Check enforcement and active analytics
- Real reminders or FCM/push/email/SMS notifications

## Repo Structure
- `skills.md` — repo-level build rules for Antigravity
- `agents.md` — role-based agent responsibilities
- `.ai/tasks/` — task templates and output for Antigravity
- `apps/web` — frontend app
- `services/api` — Cloud Run backend
- `packages/shared` — shared types/utilities
- `docs/` — architecture, source registry, testing, and release notes