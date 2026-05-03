# VoteReady India

**Ask. Understand. Be vote-ready.**

VoteReady India is an interactive civic education assistant that helps young Indians understand how elections work, what applies to their situation, and what to do next through simple, source-backed guidance.

### Public Deployed Application
**Frontend URL**: [https://voteready-india-web-529590785617.asia-south1.run.app](https://voteready-india-web-529590785617.asia-south1.run.app)
**Backend API URL**: [https://voteready-india-api-529590785617.asia-south1.run.app](https://voteready-india-api-529590785617.asia-south1.run.app)

> **Status**: This application is now fully integrated with Google Cloud services. Gemini model calls, Firestore source registry, Firebase Authentication, and Analytics are active and functional.

## Project Overview

### Chosen Vertical
**Civic Education & Election Readiness**: VoteReady India addresses the challenge of navigating complex electoral processes for young and first-time voters in India.

### Approach and Logic
Our approach is built on a **"Source-Trust Architecture"**. We prioritize official government data (ECI-first) and use Generative AI to simplify complex procedural information without losing accuracy.
- **Grounded AI**: Gemini 2.5 Flash generates responses strictly grounded in a verified Firestore source registry.
- **Safety-First**: A deterministic classifier routes procedural and political questions to safe, neutral, or "cannot-verify" states.
- **Multi-Language Support**: Accessible guidance in English, Hindi, and Hinglish.
- **Privacy-Safe Analytics**: All tracking is anonymized and avoids PII/sensitive content.

### How the Solution Works
1.  **User Input**: A user asks a question or selects a guided journey.
2.  **Intent Detection**: The system classifies the intent (General, Procedural, Political, etc.).
3.  **Grounded Retrieval**: The Cloud Run API queries the Firestore Source Registry for relevant official fragments.
4.  **Generative Simplification**: Gemini 2.5 Flash processes the official text and user context to produce a simple, clear explanation.
5.  **Verified Presentation**: The user receives the response accompanied by "Source Cards" linking to original official documents.

### Assumptions Made
- Users have basic internet connectivity and digital literacy.
- Official sources (Election Commission of India) remain the primary source of truth.
- High-level procedural changes are captured in the source registry.

## Google Services Integration

The application leverages the full Google Cloud ecosystem for a premium, scalable experience:

- **Google Cloud Run**: Hosts the Frontend (Vite) and Backend API (Node.js/Express) services.
- **Gemini (AI)**: Powers the conversational engine for grounded, multilingual guidance.
- **Firestore (Data)**: Acts as the Source Registry and the persistent store for "Saved Guidance" and user settings.
- **Firebase Authentication**: Provides secure Google Sign-In for account-based features.
- **Firebase Analytics**: Tracks product interactions securely without PII.

## Evidence of Integration
- **Grounded Assistant**: Responses include source metadata and freshness indicators fetched from Firestore.
- **Live Auth**: Sign-in with Google is active in the "Account & Sync" panel.
- **Cloud Sync**: Saved items are synchronized to Firestore when signed in.
- **Privacy Dashboard**: Real-time analytics events are visible in the Firebase Console (anonymized).

## Local Setup Instructions

### Prerequisites
- Node.js (Latest LTS recommended)
- `npm`

### Environment Setup
1. Copy `.env.example` to `.env` in the root directory.
2. Copy `apps/web/.env.example` to `apps/web/.env`.
3. Populated the `GEMINI_API_KEY` and Firebase config variables to enable full functionality locally.

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
```

## Repo Structure
- `apps/web` — Frontend application (Vite/React)
- `services/api` — Cloud Run backend service
- `packages/shared` — Shared types and domain logic
- `docs/` — Architecture, source registry, and testing notes
- `skills.md` — Repo-level build rules
- `agents.md` — Role-based agent collaboration model