# Task 011 — Add API Unit Tests for Health, Metadata, Source Registry, and Mock Assistant Routes

## Status
In Progress

## Branch
test/api-routes-task-011

## Goal

Add automated tests for the existing Cloud Run API routes.

This task should verify the current API contract behavior for:

```text
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock

```

This is a test-only task with minimal app-structure adjustment only if needed to make the Express app testable.

----------

## Why

Tasks 001–010 established the API shell, shared contracts, source registry metadata, mock assistant endpoint, route modules, shared supported options, and shared mock fixtures.

Before moving toward real assistant orchestration, Gemini, source grounding, or Firestore integration, the current API behavior should be protected by automated tests.

This improves:

-   regression safety
    
-   API contract stability
    
-   confidence before adding real assistant logic
    
-   challenge scoring for testing and code quality
    
-   future refactor safety
    

----------

## In Scope

Add API route tests for:

1.  `GET /health`
    
2.  `GET /metadata`
    
3.  `GET /source-registry`
    
4.  `POST /assistant/mock` with a valid request
    
5.  `POST /assistant/mock` with invalid requests
    

The tests should verify:

-   HTTP status codes
    
-   core response fields
    
-   source registry count
    
-   supported language and explanation mode arrays
    
-   mock assistant response shape
    
-   mock assistant response safety:
    
    -   no sources returned
        
    -   mock/development disclaimer present
        
    -   no real election guidance added
        
-   invalid mock assistant requests return `400`
    

----------

## Recommended Test Stack

Use a small, standard TypeScript-friendly test setup.

Recommended:

```text
vitest
supertest
@types/supertest

```

Add these as dev dependencies only where appropriate, preferably under `services/api`.

Do not add heavy testing frameworks or browser/e2e tooling in this task.

----------

## Recommended Files

Likely files:

```text
services/api/package.json
services/api/vitest.config.ts
services/api/src/app.ts
services/api/src/server.ts
services/api/src/routes/*.ts
services/api/src/routes/api.test.ts
package.json
package-lock.json

```

Only add/update files that are needed.

----------

## App Structure Requirement

If the current server starts listening directly in `server.ts`, refactor minimally so tests can import the Express app without starting a port.

Preferred structure:

```text
services/api/src/app.ts
services/api/src/server.ts

```

### `app.ts`

Responsible for:

-   creating the Express app
    
-   applying middleware
    
-   mounting routes
    
-   exporting the app or a `createApp()` function
    

### `server.ts`

Responsible for:

-   importing the app
    
-   reading the port
    
-   calling `listen`
    

This refactor must preserve runtime behavior.

Do not change endpoint behavior.

----------

## Required Test Cases

### Health route

Test:

```text
GET /health

```

Expected:

-   status `200`
    
-   `ok` is `true`
    
-   `service` is `voteready-api`
    
-   `version` exists
    
-   `timestamp` exists
    

----------

### Metadata route

Test:

```text
GET /metadata

```

Expected:

-   status `200`
    
-   `appName` exists
    
-   `tagline` exists
    
-   `apiVersion` exists
    
-   `environment` exists
    
-   `supportedLanguages` includes:
    
    -   `english`
        
    -   `simple_english`
        
    -   `hinglish`
        
    -   `hindi`
        
-   `supportedExplanationModes` includes:
    
    -   `quick`
        
    -   `simple`
        
    -   `detailed`
        
-   `generatedAt` exists
    

----------

### Source registry route

Test:

```text
GET /source-registry

```

Expected:

-   status `200`
    
-   `sources` is an array
    
-   `count` equals `sources.length`
    
-   `count` is at least `7`
    
-   every source has:
    
    -   `id`
        
    -   `title`
        
    -   `sourceType`
        
    -   `jurisdictionLevel`
        
    -   `freshnessStatus`
        
-   no source should be marked as `verified` unless current repo evidence supports it
    

----------

### Mock assistant valid request

Test:

```text
POST /assistant/mock

```

With:

```json
{
  "question": "Can you confirm the assistant contract is connected?",
  "language": "simple_english",
  "explanationMode": "simple"
}

```

Expected:

-   status `200`
    
-   response has `id`
    
-   status is safe, preferably `cannot_verify`
    
-   language echoes `simple_english`
    
-   explanation mode echoes `simple`
    
-   `answerBlocks` is non-empty
    
-   `sources` is an empty array
    
-   `freshnessSummary` exists
    
-   `disclaimer` exists
    
-   response text clearly says real source-backed guidance is not active
    
-   response does not include procedural election guidance
    

----------

### Mock assistant invalid requests

Test at minimum:

1.  Empty body
    
2.  Missing question
    
3.  Unsupported language
    
4.  Unsupported explanation mode
    

Expected:

-   status `400`
    
-   response includes an error message
    

----------

## Out of Scope

Do not implement:

-   new API endpoints
    
-   real assistant endpoint
    
-   Gemini integration
    
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
    
-   frontend UI tests
    
-   browser/e2e tests
    
-   web component tests
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is a test-focused task.
    
-   Do not change public API behavior.
    
-   Do not change response shapes.
    
-   Do not change validation behavior except if needed to fix a test-revealed bug; report clearly if so.
    
-   Do not add product logic.
    
-   Keep dependencies limited to test dev dependencies.
    
-   Keep tests readable and contract-focused.
    
-   Keep build, typecheck, and tests passing.
    
-   Preserve Cloud Run API runtime behavior.
    

----------

## Verification Required

Run:

```powershell
npm install
npm run build
npm run typecheck
npm test

```

If the root test script does not exist yet, add one that runs the API tests.

Also run:

```powershell
npm run dev:api

```

Manual endpoint smoke checks:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Valid mock assistant request:

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

Invalid mock assistant request:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body "{}"

```

Expected:

-   build passes
    
-   typecheck passes
    
-   API route tests pass
    
-   API still starts locally
    
-   existing endpoints still respond
    
-   no product behavior or guidance content is added
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of API test setup and route coverage
    

### What was intentionally not changed

-   no API behavior change
    
-   no new endpoints
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no UI changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   endpoint checks run
    
-   valid/invalid mock assistant checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
