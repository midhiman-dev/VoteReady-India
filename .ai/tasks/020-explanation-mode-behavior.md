# Task 020 — Add Explanation Mode Behavior for Quick, Simple, and Detailed Responses

## Status
In Progress

## Branch
feat/explanation-mode-behavior-task-020

## Goal

Add deterministic explanation-mode behavior for the safe `POST /assistant` response.

The assistant shell should shape its safe non-guidance response differently depending on:

- `quick`
- `simple`
- `detailed`

This task must not add Gemini, real assistant generation, source retrieval, or procedural election guidance.

---

## Why

Tasks 001–019 established:

- web app shell
- Cloud Run API shell
- shared contracts
- source registry metadata
- mock assistant endpoint
- real assistant endpoint shell
- Gemini config guardrails
- assistant orchestration skeleton
- safe curated source fragments
- assistant-first UI shell

The UI already exposes explanation modes. Task 020 makes those modes meaningful at the backend contract level while remaining safe and deterministic.

This prepares for future Gemini/source-grounded behavior by defining how response depth should vary.

---

## In Scope

Update the safe assistant orchestration flow so `POST /assistant` returns different safe response depth based on `explanationMode`.

Expected behavior:

### `quick`

- shortest response
- likely one compact answer block
- clear statement that real source-backed guidance is not active yet
- no procedural content

### `simple`

- medium response
- current-style response is acceptable
- includes source-transparency context if available
- no procedural content

### `detailed`

- more structured response
- may include multiple answer blocks explaining:
  - endpoint is connected
  - source-grounded guidance is not active yet
  - demo-safe source transparency fragments are available
  - what future tasks will add
- no procedural content

---

## Recommended Files

Likely files:

```text
packages/shared/src/assistantShellFixtures.ts
services/api/src/assistant/orchestrator.ts
services/api/src/assistant/orchestrator.test.ts
services/api/src/routes/api.test.ts

```

Optional if useful:

```text
packages/shared/src/assistantResponseModes.ts
packages/shared/src/index.ts

```

Keep this small and deterministic.

----------

## Response Safety Rules

All explanation modes must:

-   keep `status: "cannot_verify"`
    
-   keep `sources: []` unless current behavior safely uses metadata-only sources
    
-   keep `freshnessSummary.status: "review_due"`
    
-   clearly state that real source-backed election guidance is not active yet
    
-   avoid procedural election guidance
    
-   avoid dates, deadlines, eligibility rules, form instructions, polling instructions, or state-specific guidance
    
-   avoid claiming Gemini is active
    
-   avoid claiming verified guidance is active
    

----------

## Suggested Response Pattern

### Quick

Example safe text:

```text
VoteReady India’s assistant endpoint is connected. Current election guidance is not active yet.

```

### Simple

Example safe text:

```text
VoteReady India’s assistant endpoint is connected, but real source-backed election guidance is not active yet.

```

and:

```text
Safe demo source-transparency context is available. These fragments are not procedural guidance.

```

### Detailed

Example safe blocks:

1.  `Current status`
    
2.  `Source transparency`
    
3.  `What this means`
    
4.  `What comes next`
    

Example safe wording:

```text
This endpoint is ready for future source-grounded orchestration, but it does not yet generate election guidance.

```

----------

## Tests Required

Update or add tests for explanation mode behavior.

Test at minimum:

1.  `quick` returns a shorter response than `detailed`.
    
2.  `simple` returns safe source-transparency context.
    
3.  `detailed` returns multiple structured answer blocks.
    
4.  all modes return `cannot_verify`.
    
5.  all modes return `review_due`.
    
6.  all modes return empty sources.
    
7.  all modes avoid unsafe procedural terms:
    
    -   deadline
        
    -   Form 6
        
    -   eligible
        
    -   eligibility
        
    -   polling date
        
    -   register by
        
    -   voter ID required
        
8.  route tests confirm `/assistant` works for each mode.
    

Existing web tests should continue passing without UI changes.

----------

## Existing Behavior Must Remain Stable

These endpoints must continue to work:

```text
GET /
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock
POST /assistant

```

The assistant UI should continue working because it already passes explanation mode to `/assistant`.

----------

## Out of Scope

Do not implement:

-   Gemini SDK installation
    
-   Gemini API calls
    
-   model calls
    
-   prompt construction
    
-   prompt templates
    
-   real assistant generation
    
-   real source retrieval
    
-   source search
    
-   source ranking
    
-   source ingestion
    
-   scraping
    
-   embeddings
    
-   Firestore
    
-   Cloud Storage snapshots
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   frontend changes unless tests absolutely require it
    
-   source card UI
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    

----------

## Constraints

-   This is deterministic response-shaping only.
    
-   Do not add runtime dependencies.
    
-   Do not require Gemini configuration.
    
-   Do not expose or log secrets.
    
-   Do not modify the web app unless absolutely necessary.
    
-   Keep copy politically neutral and source-safety aligned.
    
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
npm test --workspace=@voteready/shared

```

Also run the API and web locally:

```powershell
npm run dev:api
npm run dev:web

```

Manual assistant checks:

```powershell
$quickBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "quick"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $quickBody

```

```powershell
$simpleBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $simpleBody

```

```powershell
$detailedBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "detailed"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $detailedBody

```

Expected:

-   all three modes return safe responses
    
-   `quick` is shortest
    
-   `detailed` is most structured
    
-   no response contains real election guidance
    
-   assistant UI still works
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of explanation-mode response shaping
    

### What was intentionally not changed

-   no Gemini
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding generation
    
-   no Firebase/Firestore
    
-   no frontend feature changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   manual mode checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
