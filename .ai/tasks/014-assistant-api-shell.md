# Task 014 — Add First Real Assistant API Shell Endpoint Without Gemini

## Status
In Progress

## Branch
feat/assistant-api-shell-task-014

## Goal

Add the first real assistant API route shell:

```text
POST /assistant

```

This endpoint should use the shared `AssistantRequest` and `AssistantResponse` contracts, but it must not implement Gemini, source retrieval, source grounding, or real election guidance yet.

This is an API contract shell task only.

----------

## Why

Tasks 001–013 established:

-   web app shell
    
-   Cloud Run API shell
    
-   shared assistant/source contracts
    
-   static source registry metadata
    
-   API metadata/source endpoints
    
-   mock assistant endpoint
    
-   web mock assistant contract panel
    
-   API route tests
    
-   web component tests
    
-   source registry safety labels
    

Task 014 introduces the future production endpoint path for the assistant while keeping behavior safe and non-generative.

This prepares the codebase for later tasks such as:

-   assistant orchestration skeleton
    
-   curated source fragments
    
-   source-grounded response shaping
    
-   Gemini configuration
    
-   real assistant UI
    

----------

## In Scope

Add:

```text
POST /assistant

```

The endpoint should:

1.  Accept an `AssistantRequest`.
    
2.  Validate required fields using existing shared supported option guards.
    
3.  Return an `AssistantResponse`.
    
4.  Clearly state that the real source-backed assistant is not active yet.
    
5.  Return no procedural election guidance.
    
6.  Return no sources unless a safe placeholder behavior is already contractually appropriate.
    
7.  Preserve all existing endpoints and behavior.
    

Existing endpoints must continue to work:

```text
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock

```

----------

## Recommended Files

Likely files:

```text
services/api/src/routes/assistant.ts
services/api/src/routes/index.ts
services/api/src/routes/api.test.ts

```

Optional if useful:

```text
packages/shared/src/assistantShellFixtures.ts
packages/shared/src/index.ts

```

Keep this small. Do not over-engineer.

----------

## Endpoint Behavior

### Request

Use existing shared contract:

```ts
AssistantRequest

```

Example request:

```json
{
  "question": "Can VoteReady India answer questions yet?",
  "language": "simple_english",
  "explanationMode": "simple"
}

```

### Response

Return an `AssistantResponse` with safe shell behavior.

Suggested response characteristics:

```text
status: "cannot_verify"
sources: []
freshnessSummary.status: "review_due"

```

Suggested answer block wording:

```text
VoteReady India’s assistant endpoint is connected, but source-backed election guidance is not active yet.

```

And:

```text
This endpoint does not yet use Gemini or verified source retrieval. Real guidance will be added in a later task.

```

Important:

-   Do not answer the user’s election question.
    
-   Do not provide registration steps.
    
-   Do not provide eligibility rules.
    
-   Do not mention dates or deadlines.
    
-   Do not claim verification.
    
-   Do not call this Gemini-powered yet.
    

----------

## Validation Rules

Use the same validation behavior as the mock assistant route where practical.

Return `400` if:

-   body is missing
    
-   `question` is missing or not a string
    
-   `language` is missing or unsupported
    
-   `explanationMode` is missing or unsupported
    

Do not add a validation library.

----------

## Tests Required

Update API route tests to cover:

### Valid `POST /assistant`

Expected:

-   status `200`
    
-   response has `id`
    
-   status is `cannot_verify`
    
-   language echoes request
    
-   explanation mode echoes request
    
-   answer blocks are present
    
-   sources is an empty array
    
-   disclaimer or safety message is present
    
-   response clearly says source-backed guidance is not active
    
-   response does not contain procedural election guidance
    

### Invalid `POST /assistant`

At minimum test:

-   empty body returns `400`
    
-   unsupported language returns `400`
    
-   unsupported explanation mode returns `400`
    

Also ensure existing API tests still pass.

----------

## Out of Scope

Do not implement:

-   Gemini integration
    
-   model calls
    
-   prompt construction
    
-   real assistant orchestration
    
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
    
-   frontend assistant UI
    
-   web client changes
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source cards
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is an API shell task.
    
-   Do not change existing endpoint behavior.
    
-   Do not remove or weaken `POST /assistant/mock`.
    
-   Do not add dependencies.
    
-   Keep response safe and explicit.
    
-   Keep the API modular.
    
-   Keep tests readable.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/api
npm test --workspace=@voteready/web
npm run dev:api

```

Manual endpoint checks:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Valid assistant shell request:

```powershell
$body = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $body

```

Invalid assistant shell request:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body "{}"

```

Mock assistant route should still work:

```powershell
$mockBody = @{
  question = "Can you confirm the assistant contract is connected?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body $mockBody

```

Expected:

-   build passes
    
-   typecheck passes
    
-   all tests pass
    
-   API starts locally
    
-   existing endpoints still work
    
-   `POST /assistant` valid request returns safe shell response
    
-   `POST /assistant` invalid request returns `400`
    
-   `POST /assistant/mock` still works
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of assistant API shell endpoint
    

### What was intentionally not changed

-   no Gemini
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no frontend changes
    
-   no guided journeys
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   endpoint checks run
    
-   valid/invalid assistant checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
