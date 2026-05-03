# Task 032 — Add App Check Configuration and Documentation Shell

## Status
In Progress

## Branch
chore/app-check-shell-task-032

## Goal

Add a safe Firebase App Check configuration/documentation shell.

This task should prepare the repo for future App Check protection, but it must not activate App Check enforcement, block users, call Firebase App Check APIs, or change runtime behavior yet.

This is a configuration/documentation shell task only.

---

## In Scope

Add:

- App Check environment placeholders
- App Check status/config helper
- UI status messaging if useful
- tests for App Check config guardrails
- documentation describing future App Check setup
- disabled-by-default behavior

---

## Environment Variables

Add placeholders to `.env.example` and `apps/web/.env.example`:

```text
VITE_APP_CHECK_ENABLED=false
VITE_APP_CHECK_PROVIDER=disabled
VITE_APP_CHECK_RECAPTCHA_SITE_KEY=

```

Rules:

-   do not commit real site keys
    
-   do not require App Check config for build/test
    
-   disabled by default
    
-   no App Check API calls
    
-   no enforcement
    

----------

## Recommended Files

```text
.env.example
apps/web/.env.example
apps/web/src/lib/appCheckStatus.ts
apps/web/src/lib/appCheckStatus.test.ts
apps/web/src/components/AuthStatusPanel.tsx
apps/web/src/components/AuthStatusPanel.test.tsx
docs/security/app-check.md

```

Optional:

```text
packages/shared/src/appCheck.ts
packages/shared/src/index.ts

```

----------

## Expected Behavior

Create a helper like:

```ts
export interface AppCheckStatus {
  enabled: boolean;
  configured: boolean;
  provider: "disabled" | "recaptcha_enterprise_shell" | "debug_shell";
  enforcementActive: false;
  message: string;
}

```

Expected:

-   absent env vars => disabled
    
-   enabled false => disabled
    
-   enabled true with missing site key => configured false, enforcement false
    
-   enabled true with site key => configured true, enforcement false
    
-   unknown provider => disabled/safe fallback
    
-   never expose the site key
    

----------

## UI Behavior

If updating the Account & Sync panel, show a small security readiness row:

```text
App Check: Not active yet

```

or:

```text
App Check shell configured, enforcement not active.

```

Do not show real site keys.

----------

## Documentation Required

Add:

```text
docs/security/app-check.md

```

Include:

-   purpose of App Check
    
-   current status: shell only, disabled by default
    
-   required future Firebase Console setup
    
-   required future environment variables
    
-   future enforcement checklist
    
-   current non-goals
    
-   safety warning: do not commit real keys
    

----------

## Out of Scope

Do not implement:

-   real App Check initialization
    
-   Firebase App Check SDK calls
    
-   enforcement
    
-   reCAPTCHA integration
    
-   backend token verification
    
-   protected API routes
    
-   Firebase security rules changes
    
-   Cloud Functions
    
-   Auth changes
    
-   Firestore writes
    
-   analytics activation
    
-   Gemini
    
-   source retrieval
    
-   procedural election guidance
    

----------

## Tests Required

Add tests for:

-   disabled by default
    
-   disabled when env says false
    
-   enabled but incomplete config stays non-enforcing
    
-   enabled and configured still has `enforcementActive: false`
    
-   unknown provider safely falls back
    
-   raw site key is not exposed
    
-   Account & Sync panel shows App Check inactive/status message if UI is updated
    

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

-   app loads
    
-   existing features still work
    
-   Account & Sync still says sign-in/cloud sync inactive
    
-   App Check status, if shown, is inactive/shell-only
    
-   no real App Check enforcement
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of App Check shell/config/docs
    

### What was intentionally not changed

-   no App Check enforcement
    
-   no App Check SDK calls
    
-   no backend token verification
    
-   no protected routes
    
-   no Firebase security rules deployment
    
-   no Auth/cloud sync changes
    
-   no analytics activation
    
-   no Gemini
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
