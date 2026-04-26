# Task 010 — Add Shared Mock Assistant Fixtures for Tests and Demo Safety

## Status
In Progress

## Branch
refactor/mock-assistant-fixtures-task-010

## Goal

Add shared mock assistant fixtures and a small mock response factory so API and future tests can reuse the same safe development-only assistant contract content.

This task must not add real assistant behavior.

This is a fixture/refactor task for consistency and test readiness.

---

## Why

Tasks 006 and 007 added a safe mock assistant API endpoint and web contract test panel.

Currently, mock assistant wording and response construction may live directly inside the API route and/or web component.

Before adding tests or real assistant orchestration, the safe mock contract content should be centralized in `packages/shared`.

This improves:

- consistency between API and web
- future test fixture reuse
- demo safety
- prevention of accidental procedural guidance in mock responses
- maintainability before Gemini/source-grounded work begins

---

## In Scope

Add shared mock assistant fixture utilities in `packages/shared`.

Update the mock assistant API route to use the shared fixture/factory.

Optionally update the web mock assistant panel to use the shared default safe question if it currently hardcodes it.

Preserve existing endpoint behavior and safe messaging.

---

## Recommended Files

Likely shared files:

```text id="20561p"
packages/shared/src/mockAssistantFixtures.ts
packages/shared/src/index.ts

```

Likely API file:

```text
services/api/src/routes/assistantMock.ts

```

Optional web file if it currently hardcodes the default mock question:

```text
apps/web/src/components/MockAssistantContractPanel.tsx

```

Only update other files if necessary for imports or typecheck.

----------

## Required Shared Fixture Content

Add safe constants such as:

```ts
export const DEFAULT_MOCK_ASSISTANT_QUESTION =
  "Can you confirm the assistant contract is connected?";

export const MOCK_ASSISTANT_DEVELOPMENT_DISCLAIMER =
  "This is a mock response for development only.";

export const MOCK_ASSISTANT_SOURCE_PENDING_MESSAGE =
  "Source-backed guidance is not active in this mock endpoint.";

```

Do not include election guidance, registration guidance, dates, deadlines, form rules, eligibility rules, or polling instructions.

----------

## Required Mock Response Factory

Add a small dependency-free function that returns an `AssistantResponse`.

Suggested shape:

```ts
export function createMockAssistantResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
}): AssistantResponse {
  // return safe AssistantResponse
}

```

Requirements:

-   Use the request’s `language`.
    
-   Use the request’s `explanationMode`.
    
-   Return `status: "cannot_verify"` or another safe non-guidance status already supported by the contract.
    
-   Return `sources: []`.
    
-   Include answer blocks that clearly state this is a mock contract test.
    
-   Include freshness summary with `review_due`.
    
-   Include a development-only disclaimer.
    
-   Do not generate or imply real guidance.
    
-   Do not use live source registry data.
    
-   Keep the function deterministic when `generatedAt` is provided.
    

----------

## API Refactor Requirement

Update:

```text
services/api/src/routes/assistantMock.ts

```

so it uses the shared mock response factory instead of manually constructing the mock response inline.

Do not change validation behavior.

Do not change public response shape except for harmless text centralization if needed.

----------

## Optional Web Refactor

If the web panel currently hardcodes the default mock question, update it to import:

```ts
DEFAULT_MOCK_ASSISTANT_QUESTION

```

from the shared package.

Do not redesign the panel.

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

-   This is a fixture/refactor task.
    
-   Do not add dependencies.
    
-   Do not change supported language or explanation-mode values.
    
-   Do not change public API behavior materially.
    
-   Do not change validation behavior.
    
-   Do not add product logic.
    
-   Do not modify unrelated files.
    
-   Keep code readable and minimal.
    
-   Keep build and typecheck passing.
    
-   Preserve development-only labeling of the mock assistant experience.
    

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
    
-   `/assistant/mock` valid request still succeeds
    
-   `/assistant/mock` invalid request still returns `400`
    
-   mock assistant panel still works
    
-   mock response still clearly says real source-backed guidance is not active
    
-   source count remains `0`
    
-   no real election guidance is added
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of shared mock assistant fixtures/factory
    

### What was intentionally not changed

-   no behavior change beyond fixture centralization
    
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