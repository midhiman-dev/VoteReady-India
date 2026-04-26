# Task 009 — Add Shared Supported Options Constants

## Status
In Progress

## Branch
refactor/shared-supported-options-task-009

## Goal

Add canonical supported option constants to `packages/shared` and update API/web code to consume them.

This task must remove duplicated supported language and explanation-mode option lists from API/web code without changing runtime behavior.

This is a shared-contract cleanup task, not a product feature task.

---

## Why

Earlier tasks added shared contracts for:

- `LanguagePreference`
- `ExplanationMode`
- `AssistantRequest`
- `AssistantResponse`

Later tasks introduced supported language and explanation-mode values in API route code and web UI code.

Those supported values should now live in `packages/shared` so both the API and web app consume the same canonical source.

This improves:

- type safety
- API/web consistency
- future assistant contract stability
- maintainability before real assistant/Gemini work begins

---

## In Scope

Add shared supported option constants for:

```text
LanguagePreference
ExplanationMode

```

Update existing API and web code to import and use these shared constants.

Expected supported languages:

```text
english
simple_english
hinglish
hindi

```

Expected explanation modes:

```text
quick
simple
detailed

```

----------

## Recommended Files

Likely shared files:

```text
packages/shared/src/common.ts
packages/shared/src/index.ts

```

Optional if preferred:

```text
packages/shared/src/options.ts
packages/shared/src/index.ts

```

Likely API files:

```text
services/api/src/routes/metadata.ts
services/api/src/routes/assistantMock.ts

```

Likely web files:

```text
apps/web/src/components/MockAssistantContractPanel.tsx

```

Only update other files if necessary for imports or typecheck.

----------

## Shared Constants Required

Add readonly constants similar to:

```ts
export const SUPPORTED_LANGUAGE_PREFERENCES = [
  "english",
  "simple_english",
  "hinglish",
  "hindi",
] as const satisfies readonly LanguagePreference[];

export const SUPPORTED_EXPLANATION_MODES = [
  "quick",
  "simple",
  "detailed",
] as const satisfies readonly ExplanationMode[];

```

If the repo TypeScript version or build config does not support `satisfies`, use a simpler type-safe equivalent:

```ts
export const SUPPORTED_LANGUAGE_PREFERENCES: readonly LanguagePreference[] = [
  "english",
  "simple_english",
  "hinglish",
  "hindi",
];

export const SUPPORTED_EXPLANATION_MODES: readonly ExplanationMode[] = [
  "quick",
  "simple",
  "detailed",
];

```

----------

## Optional Helpers

You may add small dependency-free type guards if useful:

```ts
export function isLanguagePreference(value: unknown): value is LanguagePreference {
  return typeof value === "string" &&
    SUPPORTED_LANGUAGE_PREFERENCES.includes(value as LanguagePreference);
}

export function isExplanationMode(value: unknown): value is ExplanationMode {
  return typeof value === "string" &&
    SUPPORTED_EXPLANATION_MODES.includes(value as ExplanationMode);
}

```

Use helpers only if they simplify existing validation. Do not add validation libraries.

----------

## Required Behavior Preservation

The following must remain unchanged:

```text
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock

```

The mock assistant panel must still show the same language and explanation mode options.

The API `/metadata` response must still list the same supported language and explanation-mode values.

The mock assistant validation must still accept and reject the same values as before.

----------

## Out of Scope

Do not implement:

-   Gemini integration
    
-   real assistant orchestration
    
-   prompt construction
    
-   source retrieval
    
-   source grounding
    
-   source ranking
    
-   source ingestion
    
-   scraping
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   new API endpoints
    
-   UI redesign
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source-card UI
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is a refactor/contract cleanup task.
    
-   Do not add new supported values.
    
-   Do not change existing public API behavior.
    
-   Do not change response shapes.
    
-   Do not add dependencies.
    
-   Do not modify unrelated files.
    
-   Keep code readable and minimal.
    
-   Keep build and typecheck passing.
    
-   Preserve the development-only labeling of the mock assistant panel.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api
npm run dev:web

```

Manual endpoint checks:

```powershell
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Mock assistant valid request:

```powershell
$body = @{
  question = "Can you confirm the assistant contract is connected?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body $body

```

Mock assistant invalid request:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body "{}"

```

Browser check:

```text
http://localhost:3000

```

Expected:

-   API starts successfully
    
-   web app starts successfully
    
-   `/metadata` still returns the same supported languages and modes
    
-   `/assistant/mock` valid request still succeeds
    
-   `/assistant/mock` invalid request still returns `400`
    
-   mock assistant panel still shows the same language and explanation-mode options
    
-   no product behavior or election guidance is added
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of shared supported option constants
    

### What was intentionally not changed

-   no behavior changes
    
-   no new supported values
    
-   no new endpoints
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no UI redesign
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   valid/invalid mock assistant checks
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
