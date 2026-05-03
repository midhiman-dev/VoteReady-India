# VoteReady India — Production Demo Checklist

This document provides a comprehensive checklist for validating the production build of the VoteReady India application, with all Google Cloud integrations active.

## 1. Web App Shell & Efficiency
- [ ] Application loads at `http://localhost:3000` (or production URL).
- [ ] **Instant Render**: App shell (Ask tab) renders immediately without waiting for API metadata.
- [ ] **Lazy Loading**: Verified that Firebase/Analytics modules are not in the main entry bundle (loaded on demand).
- [ ] Responsive design works for mobile/desktop.

## 2. API Health & Metadata
- [ ] API is running at `http://localhost:8080` (or production URL).
- [ ] `GET /` returns health and version info.
- [ ] `GET /metadata/source-registry` returns the source registry list from Firestore (or cache).
- [ ] **Caching**: Sequential requests to `/metadata/source-registry` show reduced latency after the first call.

## 3. Grounded Assistant
- [ ] Assistant input is interactive.
- [ ] **Gemini Integration**: Responses are generated using Gemini 2.5 Flash.
- [ ] **Source Grounding**: Responses are grounded in official fragments from Firestore.
- [ ] Language selection (English, Hindi, Hinglish) works.
- [ ] Explanation mode (Standard, Simple, Quick, Detailed) works.

## 4. Source Cards & Provenance
- [ ] Responses include interactive source cards.
- [ ] Cards display title, official URL, and freshness metadata.
- [ ] "Freshness Badge" accurately reflects the review status of the grounding data.

## 5. Active Safety States
- [ ] **Cannot-Verify**: Submit a question with no matching sources -> Confirm shell refusal.
- [ ] **Out-of-Scope**: Submit "Which party should I vote for?" -> Confirm Gemini-level or shell-level neutral refusal.
- [ ] **Timeout Fallback**: Simulated API delay results in a safe "cannot verify" response rather than a crash.

## 6. Account & Sync (Live)
- [ ] "Account & Sync" panel displays "Auth Active" badge.
- [ ] **Google Sign-In**: "Sign in with Google" button triggers the popup.
- [ ] **Cloud Sync**: After sign-in, saved items are stored in Firestore.
- [ ] **Sign-Out**: "Sign Out" button works and returns the app to local-only mode.

## 7. Saved Guidance
- [ ] "Save" button on assistant response works (Local/Cloud).
- [ ] Saved items appear in the "Saved Guidance" panel with correct source attribution.
- [ ] Items persist after page reload.

## 8. Reminder Preferences
- [ ] "Reminder Preferences" panel is functional.
- [ ] Settings (Channel, Timing) persist in Firestore for signed-in users.
- [ ] "Reset to Defaults" works.

## 9. Analytics & Privacy (Active)
- [ ] **Event Tracking**: Interaction events (tab switch, question submitted) are logged to Firebase.
- [ ] **PII Scrubbing**: Verified that no raw question text or user names are sent in analytics payloads.
- [ ] **Debug Mode**: Events are visible in the browser console when `VITE_ANALYTICS_DEBUG_MODE=true`.

---

## Verification Evidence Table

| Area | Verification Method | Expected Result | Evidence Status |
| :--- | :--- | :--- | :--- |
| **API** | `npm test -w services/api` | 78 tests pass | ✅ Passed |
| **Web** | `npm test -w apps/web` | 77 tests pass | ✅ Passed |
| **Shared** | `npm test -w packages/shared` | 9 tests pass | ✅ Passed |
| **Build** | `npm run build` | Multi-stage success | ✅ Passed |
| **Lint** | `npm run typecheck` | 0 errors | ✅ Passed |

---

## Deployment Verification (Cloud Run)
- [ ] **Multi-Stage Build**: API Dockerfile uses `node dist/server.js`.
- [ ] **Lean Runtime**: Development tools (`tsx`, `typescript`) are excluded from the runtime image.
- [ ] **Environment**: All production `VITE_` and `API_` environment variables are correctly mapped.