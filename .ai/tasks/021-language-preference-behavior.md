# Task 021 — Add Language Preference Handling for English, Simple English, Hinglish, and Hindi

## Status
In Progress

## Branch
feat/language-preference-behavior-task-021

## Goal

Add deterministic language preference behavior for the safe `POST /assistant` response.

The assistant shell should shape its safe non-guidance response according to the selected language:

- `english`
- `simple_english`
- `hinglish`
- `hindi`

This task must not add Gemini, external translation APIs, real assistant generation, source retrieval, or procedural election guidance.

---

## Why

Tasks 001–020 established:

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
- deterministic explanation mode behavior

The UI already exposes language preferences. Task 021 makes those language preferences meaningful at the backend response level while remaining safe and deterministic.

This prepares for future multilingual assistant behavior without relying on model-generated translation yet.

---

## In Scope

Update the safe assistant response shaping so `POST /assistant` returns language-appropriate safe shell text based on `language`.

Expected behavior:

### `english`

- standard clear English
- safe system-status response
- no procedural content

### `simple_english`

- simpler, shorter English
- easier words
- no procedural content

### `hinglish`

- Roman-script Hinglish style
- safe and neutral
- no procedural content

### `hindi`

- Hindi / Devanagari safe shell text
- safe and neutral
- no procedural content

---

## Recommended Files

Likely files:

```text
packages/shared/src/assistantShellFixtures.ts
services/api/src/assistant/orchestrator.test.ts
services/api/src/routes/api.test.ts

```

Optional if useful:

```text
packages/shared/src/assistantLanguageCopy.ts
packages/shared/src/index.ts

```

Keep this deterministic and small.

----------

## Response Safety Rules

All language variants must:

-   keep `status: "cannot_verify"`
    
-   keep `sources: []`
    
-   keep `freshnessSummary.status: "review_due"`
    
-   clearly state that current election guidance is not active yet
    
-   clearly state that source-backed procedural guidance is not active yet
    
-   avoid dates, deadlines, eligibility rules, form instructions, polling instructions, or state-specific guidance
    
-   avoid claiming Gemini is active
    
-   avoid claiming verified guidance is active
    
-   avoid political or persuasive language
    

----------

## Suggested Safe Copy Direction

### English

```text
VoteReady India’s assistant endpoint is connected. Current election guidance is not active yet.

```

### Simple English

```text
VoteReady India is connected. It cannot give current election guidance yet.

```

### Hinglish

```text
VoteReady India assistant connected hai. Abhi current election guidance active nahi hai.

```

### Hindi

```text
VoteReady India सहायक जुड़ा हुआ है। वर्तमान चुनाव मार्गदर्शन अभी सक्रिय नहीं है।

```

These are examples only. Keep wording safe and non-procedural.

----------

## Explanation Mode Compatibility

Language behavior must work together with existing explanation modes:

-   `quick`
    
-   `simple`
    
-   `detailed`
    

Expected:

-   `quick + hindi` returns short Hindi safe response
    
-   `simple + hinglish` returns medium Hinglish safe response
    
-   `detailed + simple_english` returns structured simple English safe response
    
-   all combinations remain safe and non-procedural
    

Do not remove or weaken Task 020 explanation-mode behavior.

----------

## Tests Required

Update or add tests for language behavior.

Test at minimum:

1.  `english` returns English safe text.
    
2.  `simple_english` returns simpler safe text.
    
3.  `hinglish` returns Hinglish safe text.
    
4.  `hindi` returns Hindi / Devanagari safe text.
    
5.  all languages preserve `cannot_verify`.
    
6.  all languages preserve `review_due`.
    
7.  all languages preserve empty sources.
    
8.  all languages work with at least one explanation mode.
    
9.  detailed mode still returns multiple blocks.
    
10.  all languages avoid unsafe procedural terms:
    

-   deadline
    
-   Form 6
    
-   eligible
    
-   eligibility
    
-   polling date
    
-   register by
    
-   voter ID required
    

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

The assistant UI should continue working because it already passes language and explanation mode to `/assistant`.

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
    
-   Do not use external translation services.
    
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

Manual language checks:

```powershell
$englishBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "english"
  explanationMode = "quick"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $englishBody

```

```powershell
$simpleEnglishBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $simpleEnglishBody

```

```powershell
$hinglishBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "hinglish"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $hinglishBody

```

```powershell
$hindiBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "hindi"
  explanationMode = "detailed"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $hindiBody

```

Expected:

-   all four languages return safe responses
    
-   selected language is echoed in response
    
-   explanation mode behavior still works
    
-   no response contains real election guidance
    
-   assistant UI still works
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of language preference response shaping
    

### What was intentionally not changed

-   no Gemini
    
-   no external translation service
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding generation
    
-   no Firebase/Firestore
    
-   no frontend feature changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   manual language checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
