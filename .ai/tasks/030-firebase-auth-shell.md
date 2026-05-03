# Task 030 — Add Firebase Auth Shell for Saved User Flows

## Status
In Progress

## Branch
feat/firebase-auth-shell-task-030

## Goal

Add a safe Firebase Auth shell for future saved user flows.

This task should prepare the web app for future account-based saved guidance sync, but it must not activate real sign-in, user accounts, anonymous auth, Firestore user writes, or cloud sync yet.

The current app must remain usable without login.

Saved Guidance must remain localStorage-backed by default.

---

## Why

Tasks 001–029 established:

- web app shell
- Cloud Run API shell
- assistant endpoint
- assistant-first UI shell
- source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser shell
- Election Basics explainer shell
- local Saved Guidance shell
- local Reminder Preferences shell
- disabled-by-default Firebase/Firestore Saved Guidance shell

Task 030 adds the next safe foundation: Firebase Auth readiness.

Because Auth is a sensitive user-facing capability, this task should only expose an account/auth shell and guardrails. Actual login, user sessions, and Firestore sync should be implemented later.

---

## In Scope

Add a disabled-by-default Firebase Auth shell.

This task should:

1. Add Firebase Auth environment placeholders.
2. Add a Firebase Auth status/config helper.
3. Add an Account / Sync shell UI panel.
4. Clearly state that sign-in and cloud sync are not active yet.
5. Keep Saved Guidance local-only by default.
6. Keep Firestore sync inactive.
7. Add tests for Auth status guardrails and UI messaging.
8. Preserve existing assistant, saved guidance, reminders, journeys, election basics, metadata, and source registry behavior.

---

## Environment Variables

Add placeholders to `.env.example` and `apps/web/.env.example` if appropriate.

Recommended Vite variables:

```text
VITE_FIREBASE_AUTH_ENABLED=false
VITE_FIREBASE_AUTH_PROVIDER_MODE=disabled

```

If helpful, also document future provider placeholders without activating them:

```text
VITE_FIREBASE_AUTH_GOOGLE_ENABLED=false

```

Important:

-   Do not commit real Firebase config values.
    
-   Do not create or commit `.env`.
    
-   Do not require Firebase Auth for build/test.
    
-   Firebase Auth must be disabled by default.
    
-   Do not collect or store email, phone, display name, UID, or profile data in this task.
    
-   Do not call signIn/signOut APIs in this task.
    

----------

## Recommended Files

Likely files:

```text
.env.example
apps/web/.env.example
apps/web/src/lib/firebaseAuthStatus.ts
apps/web/src/lib/firebaseAuthStatus.test.ts
apps/web/src/components/AuthStatusPanel.tsx
apps/web/src/components/AuthStatusPanel.test.tsx
apps/web/src/components/SavedGuidancePanel.tsx
apps/web/src/components/SavedGuidancePanel.test.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional only if useful:

```text
packages/shared/src/authShell.ts
packages/shared/src/index.ts

```

Do not add backend files or API routes.

----------

## Suggested Auth Status Model

If adding a shared type, use something like:

```ts
export type AuthShellMode =
  | "disabled"
  | "firebase_config_ready_auth_inactive"
  | "auth_future_ready";

export interface AuthShellStatus {
  mode: AuthShellMode;
  authEnabled: boolean;
  firebaseConfigured: boolean;
  signInActive: false;
  cloudSyncActive: false;
  message: string;
}

```

Important:

-   `signInActive` must remain `false`.
    
-   `cloudSyncActive` must remain `false`.
    
-   Do not add a real authenticated user object yet.
    

----------

## Firebase Auth Status Helper Requirements

Create a helper such as:

```ts
export function getFirebaseAuthShellStatus(params: {
  authEnabled?: string;
  providerMode?: string;
  firebaseConfigured: boolean;
}): AuthShellStatus;

```

Expected behavior:

### Default

If Auth env vars are absent:

```text
authEnabled: false
mode: disabled
signInActive: false
cloudSyncActive: false

```

### Auth disabled

If:

```text
VITE_FIREBASE_AUTH_ENABLED=false

```

Return disabled status.

### Auth enabled but Firebase incomplete

If Auth is enabled but Firebase config is incomplete:

```text
authEnabled: true
firebaseConfigured: false
mode: disabled
signInActive: false
cloudSyncActive: false

```

Show safe message that Auth cannot be activated until Firebase config and future Auth flow are ready.

### Firebase configured and Auth enabled

If Firebase config is complete and Auth is enabled:

```text
mode: firebase_config_ready_auth_inactive
signInActive: false
cloudSyncActive: false

```

Still do not activate login or sync.

----------

## UI Behavior

Add an Account / Sync shell panel.

Suggested title:

```text
Account & Sync

```

or:

```text
Account Sync Status

```

Required messaging:

```text
Sign-in is not active yet.

```

```text
Saved guidance remains stored locally in this browser.

```

```text
Account-based cloud sync will require a future Auth task before it can be used.

```

The panel may show status rows:

-   Sign-in: Not active
    
-   Cloud sync: Not active
    
-   Saved guidance storage: Local browser only
    
-   Firebase config: Disabled / ready shell, depending on config helper
    

Do not show active sign-in buttons.

If a sign-in button placeholder is shown, it must be disabled and clearly labeled:

```text
Sign in unavailable

```

Do not collect email, phone, name, or any identity data.

----------

## Saved Guidance Integration

Update Saved Guidance messaging if useful to reference the Auth shell.

Current behavior must remain:

-   local save works
    
-   local remove works
    
-   local clear all works
    
-   localStorage remains active
    
-   no Firestore writes
    
-   no account sync
    

Saved Guidance should not require sign-in.

----------

## Placement in App

Recommended page order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  Saved Guidance panel
    
4.  Account & Sync shell
    
5.  Reminder Preferences panel
    
6.  Guided Journey chooser
    
7.  Election Basics explainer shell
    
8.  API metadata
    
9.  Source registry preview
    

Do not remove or weaken existing sections.

----------

## Tests Required

Add tests for Auth shell behavior.

### Auth status helper tests

Test:

1.  Auth disabled by default.
    
2.  Auth disabled when `VITE_FIREBASE_AUTH_ENABLED=false`.
    
3.  Auth enabled but Firebase incomplete stays inactive.
    
4.  Auth enabled and Firebase configured returns ready-shell status.
    
5.  `signInActive` is always false.
    
6.  `cloudSyncActive` is always false.
    
7.  No raw Firebase values or secrets are exposed.
    

### UI tests

Test:

1.  Account & Sync heading renders.
    
2.  Sign-in inactive message renders.
    
3.  Cloud sync inactive message renders.
    
4.  Local browser storage message renders.
    
5.  No active sign-in form appears.
    
6.  No email/phone/name input appears.
    
7.  Saved Guidance local behavior still works.
    
8.  No procedural election guidance appears.
    

Forbidden terms in Auth shell UI:

```text
Form 6
register by
deadline
eligible if
eligibility criteria
advance registration
voter ID required
polling date
submit this document
carry this document
go to this portal

```

Also avoid identity collection fields:

```text
email address
phone number
full name
UID

```

unless explicitly stating they are not collected.

----------

## Out of Scope

Do not implement:

-   real Firebase Auth sign-in
    
-   sign-out
    
-   login/logout UI
    
-   Google sign-in
    
-   email/password sign-in
    
-   phone auth
    
-   anonymous auth
    
-   user accounts
    
-   user profile
    
-   auth state listeners
    
-   Firestore user documents
    
-   account-based cloud sync
    
-   backend auth verification
    
-   backend Firebase Admin
    
-   protected API routes
    
-   security rules deployment
    
-   FCM
    
-   notifications
    
-   reminders activation
    
-   Gemini
    
-   model calls
    
-   source retrieval
    
-   source grounding generation
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, document instructions, or state-specific guidance
    

----------

## Constraints

-   This is a frontend Auth shell task.
    
-   Auth must be disabled by default.
    
-   Do not activate real login.
    
-   Do not collect identity data.
    
-   Do not write to Firestore.
    
-   Do not change API behavior.
    
-   Do not add backend routes.
    
-   Do not require Firebase config for build/test.
    
-   Do not commit real Firebase config.
    
-   Keep saved guidance local-first.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Verification Required

Run:

```powershell
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
    
-   Saved Guidance still works locally
    
-   Account & Sync shell appears
    
-   sign-in is clearly inactive
    
-   cloud sync is clearly inactive
    
-   no sign-in form is active
    
-   no identity data is collected
    
-   Reminder Preferences still works
    
-   Guided Journeys still work
    
-   Election Basics still works
    
-   metadata and source registry preview still work
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Firebase Auth shell and guardrails
    

### What was intentionally not changed

-   no real sign-in
    
-   no sign-out
    
-   no Auth state listener
    
-   no anonymous auth
    
-   no user accounts
    
-   no Firestore user writes
    
-   no cloud sync activation
    
-   no backend Auth routes
    
-   no Firebase Admin
    
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
