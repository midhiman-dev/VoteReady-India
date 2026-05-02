# Task 022 — Add Source Cards to Assistant Responses

## Status
Completed

## Branch
feat/assistant-source-cards-task-022

## Goal

Add safe source metadata cards to assistant responses.

The assistant response should include source metadata records connected to the existing curated demo source fragments and static source registry.

This task must not make the assistant generate real election guidance.

---

## Why

Tasks 001–021 established:

- web app shell
- Cloud Run API shell
- shared contracts
- static source registry metadata
- curated demo source fragments
- mock assistant endpoint
- assistant endpoint shell
- assistant orchestration skeleton
- Gemini config guardrails
- explanation mode behavior
- language preference behavior
- assistant-first web UI shell

The next safe step is to show how source metadata will travel with assistant responses.

This supports:

- future source-backed answer UI
- source transparency
- freshness visibility
- manual-review safety
- clearer distinction between source metadata and verified procedural guidance

---

## In Scope

Update the assistant flow so `POST /assistant` returns safe source metadata cards.

The source cards should come from existing static metadata only:

- `INITIAL_SOURCE_REGISTRY`
- source IDs linked from `SAFE_DEMO_SOURCE_FRAGMENTS`

The response may include source records such as:

- ECI official website
- Voters’ Services Portal

Only include metadata fields already available in `SourceRecord`.

---

## Required Behavior

`POST /assistant` should:

1. Accept the existing `AssistantRequest`.
2. Preserve current validation behavior.
3. Preserve language-specific behavior from Task 021.
4. Preserve explanation-mode behavior from Task 020.
5. Use curated demo source fragments to identify linked source records.
6. Return source metadata in `AssistantResponse.sources`.
7. Clearly say these are metadata references, not verified procedural guidance.
8. Keep `status: "cannot_verify"`.
9. Keep `freshnessSummary.status: "review_due"`.
10. Avoid real election guidance.

---

## Recommended Files

Likely backend/shared files:

```text
services/api/src/assistant/sourceGrounding.ts
services/api/src/assistant/orchestrator.ts
services/api/src/assistant/orchestrator.test.ts
services/api/src/routes/api.test.ts

```

Likely frontend files:

```text
apps/web/src/components/AssistantResponsePreview.tsx
apps/web/src/components/AssistantResponsePreview.test.tsx
apps/web/src/App.css

```

Optional only if useful:

```text
packages/shared/src/sourceCardHelpers.ts
packages/shared/src/index.ts

```

Do not over-engineer.

----------

## Source Card Rules

Allowed source card fields:

-   title
    
-   source type
    
-   jurisdiction level
    
-   jurisdiction name if available
    
-   publisher if available
    
-   freshness status
    
-   last checked / verified timestamp if already present
    
-   source summary if already present
    

Required safety messaging near source cards:

```text
Source metadata only. These records are not verified procedural guidance yet.

```

Or equivalent safe wording.

Do not show source cards as proof of a real answer.

Do not mark review-due sources as verified.

Do not add procedural claims into source cards.

----------

## Assistant Response Source Rules

The `/assistant` response may include linked source records if they are derived from safe demo fragments.

Expected:

```text
sources.length > 0

```

but all source records should remain metadata-only and should not imply verified guidance.

The `/assistant/mock` endpoint should remain unchanged unless tests require otherwise.

Preferred:

```text
/assistant/mock sources remain []

```

----------

## Freshness Display Rules

Human-readable UI labels should be used where source cards are rendered:

```text
verified -> Verified
review_due -> Review due
stale -> Stale
archived -> Archived
unverified -> Unverified

```

If current response preview already has freshness rendering utilities, reuse them.

If not, add minimal local helper logic.

Do not rely only on color.

----------

## Web UI Behavior

Update the assistant response preview so that when `AssistantResponse.sources` contains records, the UI shows source metadata cards.

Each card should clearly display:

-   source title
    
-   source type
    
-   jurisdiction level
    
-   freshness label
    
-   publisher if available
    
-   metadata-only safety note
    

If `sources` is empty, preserve current behavior such as:

```text
Sources returned: 0

```

or equivalent.

----------

## Tests Required

Update or add tests.

### API/orchestrator tests

Verify:

1.  `/assistant` valid request returns source metadata records.
    
2.  response status remains `cannot_verify`.
    
3.  freshness summary remains `review_due`.
    
4.  returned sources are linked to demo fragments.
    
5.  returned sources are not marked `verified`.
    
6.  response text clearly says source cards are metadata-only or procedural guidance is not active.
    
7.  `/assistant/mock` still returns empty sources.
    
8.  no unsafe procedural terms appear:
    
    -   deadline
        
    -   Form 6
        
    -   eligible
        
    -   eligibility
        
    -   polling date
        
    -   register by
        
    -   voter ID required
        

### Web tests

Update `AssistantResponsePreview` tests to verify:

1.  source cards render when sources are present.
    
2.  source title renders.
    
3.  freshness status renders as human-readable label.
    
4.  metadata-only safety note renders.
    
5.  empty source behavior still works.
    
6.  source cards do not imply verified procedural guidance.
    

----------

## Out of Scope

Do not implement:

-   Gemini SDK installation
    
-   Gemini API calls
    
-   model calls
    
-   external translation APIs
    
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
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final production source-card design
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    

----------

## Constraints

-   This task is source-card metadata wiring only.
    
-   Do not add runtime dependencies.
    
-   Do not require Gemini configuration.
    
-   Do not use external translation services.
    
-   Do not expose or log secrets.
    
-   Do not change source registry seed data unless absolutely required.
    
-   Do not mark sources as verified.
    
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

Also run API and web locally:

```powershell
npm run dev:api
npm run dev:web

```

Manual assistant check:

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

Expected:

-   response includes source metadata records
    
-   source records are not marked verified
    
-   response remains `cannot_verify`
    
-   response remains `review_due`
    
-   no real election guidance appears
    

Manual browser check:

```text
http://localhost:3000

```

Expected:

-   assistant UI still works
    
-   response preview shows safe source metadata cards
    
-   metadata-only note appears
    
-   source registry preview still works
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of source metadata cards in assistant responses
    

### What was intentionally not changed

-   no Gemini
    
-   no external translation service
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding generation
    
-   no Firebase/Firestore
    
-   no procedural election guidance
    
-   no source verification workflow
    

### Verification performed

-   commands run
    
-   tests run
    
-   manual source-card checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues