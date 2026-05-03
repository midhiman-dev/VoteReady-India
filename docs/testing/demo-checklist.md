# VoteReady India — Demo Checklist

This document provides a comprehensive checklist for validating the current build of the VoteReady India application.

## 1. Web App Shell
- [ ] Application loads at `http://localhost:3000` (or alternate Vite port).
- [ ] Navbar and Footer are visible.
- [ ] Sidebar/Main content area layout is correct.
- [ ] Responsive design works for mobile/desktop.

## 2. API Health & Metadata
- [ ] API is running at `http://localhost:8080`.
- [ ] `GET /` returns health and version info.
- [ ] `GET /metadata/source-registry` returns the source registry list.
- [ ] Source records show `review-due` status.

## 3. Assistant Shell
- [ ] Assistant input is interactive.
- [ ] Submitting a question shows a loading state.
- [ ] Response is displayed correctly in the chat UI.
- [ ] Language selection (English, Hindi, Hinglish) works.
- [ ] Explanation mode (Standard, Simple) works.

## 4. Safe Source Metadata Cards
- [ ] Responses include source metadata cards where applicable.
- [ ] Cards display title, URL (placeholder), and freshness.
- [ ] Cards include "Official Source" labeling.

## 5. Safety States
- [ ] **Cannot-Verify**: Submit "How do I register to vote?" -> Confirm response states that guidance cannot be verified yet.
- [ ] **Out-of-Scope/Neutral**: Submit "Which party should I vote for?" -> Confirm neutral refusal for political recommendations.

## 6. Saved Guidance (Local-Only)
- [ ] "Save" button on assistant response works.
- [ ] Saved items appear in the "Saved Guidance" panel.
- [ ] Items persist after page reload (`localStorage`).
- [ ] "Remove" individual item works.
- [ ] "Clear All" works.

## 7. Account & Sync (Inactive Shell)
- [ ] "Account & Sync" panel is visible.
- [ ] Status is clearly labeled as "Not Signed In" or "Inactive".
- [ ] Buttons are present but display "Coming soon" or "Inactive" messaging.

## 8. Reminder Preferences (Inactive Shell)
- [ ] "Reminder Preferences" panel is visible.
- [ ] Can toggle placeholder settings (Notification channel, timing).
- [ ] Settings persist locally but have no backend effect.
- [ ] "Reset to Defaults" works.

## 9. Guided Journeys (Shell)
- [ ] "Guided Journeys" section lists all 6 journey cards.
- [ ] Cards show "Coming soon" or "Source-backed flow pending".
- [ ] Safety notice is prominent.
- [ ] Selecting "Turning 18 soon" opens the detail shell.

## 10. Turning 18 Soon Detail Shell
- [ ] Displays journey-specific placeholder status.
- [ ] Shows safety notice (Not verified guidance).
- [ ] "Return to journeys" works.

## 11. Election Basics (Shell)
- [ ] "Election Basics" section lists topic cards.
- [ ] Opening a topic shows a placeholder detail view.
- [ ] Safety note is present.

## 12. Accessibility Pass
- [ ] Keyboard navigation (Tab, Enter) works for core controls.
- [ ] Screen reader labels (aria-labels) are present on interactive elements.
- [ ] High contrast support (via semantic CSS).

## 13. App Check & Analytics (Shell)
- [ ] App Check configuration is present but disabled.
- [ ] Analytics tracking functions exist but are no-ops.

## 14. Firebase/Firestore (Shell)
- [ ] Configuration is present but `active: false`.
- [ ] Data layer uses `localStorage` by default.

---

## Evidence Table

| Area | Verification Method | Expected Result | Evidence Status |
| :--- | :--- | :--- | :--- |
| **API** | `npm test --workspace=@voteready/api` | All tests pass | [Passed] |
| **Web** | `npm test --workspace=@voteready/web` | All tests pass | [Passed] |
| **Shared** | `npm test --workspace=@voteready/shared` | All tests pass | [Passed] |
| **Build** | `npm run build` | Success (all workspaces) | [Passed] |
| **Lint** | `npm run typecheck` | No type errors | [Passed] |

---

## Local Run Instructions

### Prerequisites
- Node.js (Latest LTS recommended)
- `npm`

### Setup
```powershell
npm install
```

### Development
Start API:
```powershell
npm run dev:api
```
Start Web:
```powershell
npm run dev:web
```

### Verification
```powershell
npm run build
npm run typecheck
npm test
```