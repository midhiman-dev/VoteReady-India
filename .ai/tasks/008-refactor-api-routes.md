# Task 008 — Refactor API Routes into Small Modules Without Behavior Change

## Status
In Progress

## Branch
refactor/api-routes-task-008

## Goal

Refactor the Cloud Run API route handling into small, focused modules without changing runtime behavior.

This task must preserve all existing API endpoints and response shapes.

This is a no-product-logic refactor.

---

## Why

Tasks 001–007 added several API responsibilities into the Cloud Run service:

- `GET /health`
- `GET /metadata`
- `GET /source-registry`
- `POST /assistant/mock`

The API is still small, but `services/api/src/server.ts` is starting to hold multiple concerns.

Before adding future source-grounding, Gemini orchestration, or real assistant behavior, the API should have clearer route/module boundaries.

This task improves maintainability while preserving behavior exactly.

---

## In Scope

Refactor existing API code into small modules.

Preserve these endpoints:

```text
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock

```

Expected behavior:

-   same status codes
    
-   same response shapes
    
-   same validation behavior
    
-   same safe mock assistant wording
    
-   same CORS/local-dev behavior if already present
    
-   same port behavior
    
-   same build/typecheck behavior
    

----------

## Recommended Files

Likely new structure:

```text
services/api/src/server.ts
services/api/src/routes/health.ts
services/api/src/routes/metadata.ts
services/api/src/routes/sourceRegistry.ts
services/api/src/routes/assistantMock.ts

```

Optional if useful:

```text
services/api/src/routes/index.ts
services/api/src/utils/environment.ts
services/api/src/utils/http.ts

```

Keep the structure simple. Do not over-engineer.

----------

## Refactor Expectations

### `server.ts`

Should become thin and responsible mainly for:

-   creating the Express app
    
-   applying JSON middleware
    
-   applying any existing local CORS handling
    
-   registering route modules
    
-   starting the server
    

### Route modules

Each route module should own one route family:

-   health route
    
-   metadata route
    
-   source registry route
    
-   mock assistant route
    

### Validation

Move existing mock assistant validation into the assistant mock route module or a tiny colocated helper.

Do not change validation rules unless required to preserve existing behavior.

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
    
-   frontend changes
    
-   UI changes
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is a refactor-only task.
    
-   Do not change public API behavior.
    
-   Do not add dependencies.
    
-   Do not modify the web app.
    
-   Do not modify shared contracts unless a tiny import/export adjustment is absolutely required.
    
-   Keep response shapes stable.
    
-   Keep error behavior stable.
    
-   Keep build and typecheck passing.
    
-   Keep code readable and boring.
    
-   Do not introduce a framework or router abstraction beyond simple Express route modules.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api

```

Manual endpoint checks:

```powershell
Invoke-RestMethod http://localhost:8080/health
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

Expected:

-   API starts successfully
    
-   all existing endpoints still respond
    
-   valid mock assistant request still returns mock `AssistantResponse`
    
-   invalid mock assistant request still returns `400`
    
-   no response shape changes
    
-   no product logic added
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of route refactor
    

### What was intentionally not changed

-   no endpoint behavior changes
    
-   no new endpoints
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no UI changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   valid/invalid mock assistant checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
