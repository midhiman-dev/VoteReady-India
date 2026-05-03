# Task 029 — Add Firebase/Firestore Integration Shell for Saved Guidance

## Status
In Progress

## Branch
feat/firestore-saved-guidance-shell-task-029

## Goal

Add a safe Firebase/Firestore integration shell for Saved Guidance.

This task should prepare the app for future cloud sync of saved guidance, but it must not make Firestore the default persistence mechanism yet.

Saved Guidance should remain local-first and localStorage-backed by default.

Firestore support must be disabled by default and guarded by explicit environment configuration.

---

## Why

Tasks 001–028 established:

- web app shell
- Cloud Run API shell
- shared contracts
- assistant endpoint
- assistant-first UI shell
- safe source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser shell
- Election Basics explainer shell
- local Saved Guidance shell
- local Reminder Preferences shell

The next planned product capability is cloud-backed Saved Guidance.

However, because Auth/user accounts are not implemented yet, this task should only add the Firebase/Firestore integration foundation and clear UI status messaging.

Actual user-specific sync should come later with Firebase Auth.

---

## In Scope

Add a disabled-by-default Firebase/Firestore integration shell for Saved Guidance.

This task should:

1. Add Firebase web config environment placeholders.
2. Add a Firebase config helper.
3. Add a Firestore saved guidance repository abstraction.
4. Keep localStorage as the default active repository.
5. Add clear UI status messaging that cloud sync is not active yet.
6. Add tests for config guardrails and repository selection.
7. Preserve current Saved Guidance local behavior.
8. Preserve existing assistant, journeys, Election Basics, reminders, metadata, and source registry behavior.

---

## Environment Variables

Add placeholders to `.env.example` and `apps/web/.env.example` if appropriate.

Recommended Vite variables:

```text
VITE_FIREBASE_ENABLED=false
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=

```

Important:

-   Do not commit real Firebase secrets/config values.
    
-   Do not create or commit `.env`.
    
-   Do not require Firebase configuration for build/test.
    
-   Do not expose secrets in UI.
    
-   Do not log config values.
    
-   Firebase must be disabled by default.
    

----------

## Recommended Files

Likely files:

```text
.env.example
apps/web/.env.example
apps/web/package.json
package-lock.json
apps/web/src/lib/firebaseConfig.ts
apps/web/src/lib/firebaseConfig.test.ts
apps/web/src/lib/savedGuidanceRepository.ts
apps/web/src/lib/savedGuidanceRepository.test.ts
apps/web/src/components/SavedGuidancePanel.tsx
apps/web/src/components/SavedGuidancePanel.test.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/lib/firestoreSavedGuidanceRepository.ts

```

Only update other files if necessary for imports, typecheck, or tests.

----------

## Firebase Dependency

Add the Firebase web SDK only if needed for this shell.

Preferred:

```text
firebase

```

Add it under `apps/web` dependencies only.

Do not add Firebase Admin SDK.

Do not add backend Firebase integration in this task.

----------

## Firebase Config Helper Requirements

Create a helper such as:

```ts
export interface FirebaseClientConfigStatus {
  enabled: boolean;
  configured: boolean;
  projectIdPresent: boolean;
  appIdPresent: boolean;
  apiKeyPresent: boolean;
}

export function getFirebaseClientConfigStatus(
  env?: ImportMetaEnvLike
): FirebaseClientConfigStatus;

```

Expected behavior:

### Disabled by default

If `VITE_FIREBASE_ENABLED` is missing or false:

```ts
enabled: false
configured: false

```

No throw.

### Enabled but incomplete

If enabled but required config is missing:

```ts
enabled: true
configured: false

```

No crash in the UI.

Show cloud sync as unavailable.

### Enabled and configured

If enabled and required config exists:

```ts
enabled: true
configured: true

```

But do not perform real user sync yet unless a safe repository shell is explicitly implemented.

----------

## Saved Guidance Repository Requirements

Create a repository abstraction.

Example:

```ts
export type SavedGuidanceRepositoryMode =
  | "local_storage"
  | "firestore_unavailable"
  | "firestore_ready_shell";

export interface SavedGuidanceRepositoryStatus {
  mode: SavedGuidanceRepositoryMode;
  cloudSyncEnabled: boolean;
  message: string;
}

```

Expected behavior:

-   default mode: `local_storage`
    
-   if Firebase disabled: localStorage remains active
    
-   if Firebase enabled but incomplete: localStorage remains active and cloud sync unavailable
    
-   if Firebase enabled and configured: show `firestore_ready_shell`, but do not require login or perform account sync yet
    

Do not store saved guidance in Firestore by default without Auth.

Do not create anonymous user identifiers.

Do not collect user identity.

----------

## UI Behavior

Update Saved Guidance panel to show sync status.

Required messaging:

```text
Saved guidance is stored locally in this browser.

```

If Firebase is disabled:

```text
Cloud sync is not active yet.

```

If Firebase is configured but Auth is not available:

```text
Firestore configuration is available, but account-based sync is not active until a future Auth task.

```

The panel should still allow:

-   local save
    
-   local remove
    
-   local clear all
    

Do not remove localStorage behavior.

----------

## Data Safety Rules

Do not store in Firestore yet unless explicitly guarded as shell-only test code.

Do not store:

-   personal identity
    
-   email
    
-   phone number
    
-   precise location
    
-   auth tokens
    
-   secrets
    
-   full source content
    
-   real procedural guidance
    

Saved guidance remains minimal metadata.

----------

## Tests Required

Add tests for:

### Firebase config helper

1.  disabled by default
    
2.  enabled false
    
3.  enabled true with missing config
    
4.  enabled true with complete config
    
5.  does not expose actual config values in returned status
    

### Repository selection

1.  Firebase disabled -> local storage mode
    
2.  Firebase incomplete -> local storage mode with unavailable sync message
    
3.  Firebase configured -> firestore ready shell status
    
4.  local save/remove/clear still works
    

### UI tests

1.  Saved Guidance panel shows local-only note
    
2.  cloud sync inactive message appears by default
    
3.  local save behavior still works
    
4.  no procedural guidance appears
    

----------

## Out of Scope

Do not implement:

-   Firebase Auth
    
-   user accounts
    
-   login/logout
    
-   account-based cloud sync
    
-   anonymous auth
    
-   backend Firebase Admin
    
-   Firestore security rules deployment
    
-   Cloud Functions
    
-   push notifications
    
-   FCM
    
-   reminders
    
-   email/SMS/calendar integration
    
-   source retrieval
    
-   source grounding generation
    
-   Gemini
    
-   model calls
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, document instructions, or state-specific guidance
    

----------

## Constraints

-   Firebase/Firestore must be disabled by default.
    
-   LocalStorage must remain the active default storage.
    
-   Do not change API behavior.
    
-   Do not add backend routes.
    
-   Do not require Firebase config for build/test.
    
-   Do not commit real Firebase config values.
    
-   Do not collect personal identity data.
    
-   Do not add cloud writes without Auth.
    
-   Keep copy neutral, safe, and transparent.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Verification Required

Run:

```powershell
npm install
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web
npm test --workspace=@voteready/api
npm test --workspace=@voteready/shared

```

Manual smoke check:

```powershell
npm run dev:api
npm run dev:web

```

Open:

```text
http://localhost:3000

```

Expected:

-   web app loads
    
-   assistant shell still works
    
-   saved guidance still works locally
    
-   Saved Guidance panel shows cloud sync inactive / not active yet
    
-   local save persists across reload
    
-   remove and clear all still work
    
-   Reminder Preferences still works
    
-   guided journeys still work
    
-   Election Basics still works
    
-   metadata and source registry preview still work
    
-   no real cloud sync is active by default
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Firebase/Firestore Saved Guidance shell
    

### What was intentionally not changed

-   no Firebase Auth
    
-   no user accounts
    
-   no active cloud sync
    
-   no anonymous auth
    
-   no backend Firebase Admin
    
-   no Firestore writes by default
    
-   no reminders/FCM
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding generation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues