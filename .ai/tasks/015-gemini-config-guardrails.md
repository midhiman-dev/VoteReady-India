# Task 015 — Add Gemini Configuration Shell and Environment Guardrails

## Status
In Progress

## Branch
chore/gemini-config-task-015

## Goal

Add a safe Gemini configuration shell and environment guardrails for future assistant orchestration.

This task must not call Gemini, add model SDK logic, generate answers, retrieve sources, or change assistant endpoint behavior.

It should only prepare the API service for future Gemini integration by defining safe environment variable handling, configuration helpers, and tests.

---

## Why

Tasks 001–014 established:

- web app shell
- Cloud Run API shell
- shared contracts
- source registry metadata
- mock assistant endpoint
- first real assistant endpoint shell
- API and web tests

Task 015 prepares the backend for future Gemini-powered assistant work without activating Gemini yet.

This supports:

- safe secret handling
- local/dev/prod configuration clarity
- future Gemini orchestration
- challenge-readiness for Google-native implementation
- prevention of accidental model calls without configuration
- safer incremental development

---

## In Scope

Add configuration shell support for future Gemini usage.

Recommended behavior:

1. Add environment variable documentation for Gemini config.
2. Add an API-side config module for Gemini settings.
3. Add safe config helpers that never expose secret values.
4. Add guardrails so missing Gemini configuration does not break local build/test.
5. Add tests for configuration behavior.
6. Preserve current assistant endpoint behavior.

---

## Environment Variables

Add safe examples to `.env.example` and/or `services/api/.env.example` if that file exists.

Recommended variables:

```text
GEMINI_ENABLED=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_MS=15000

```

Important:

-   Do not commit real secrets.
    
-   Do not create or commit `.env`.
    
-   Do not require `GEMINI_API_KEY` for local build/test when `GEMINI_ENABLED=false`.
    
-   Do not expose `GEMINI_API_KEY` from any API response.
    
-   Do not log `GEMINI_API_KEY`.
    

----------

## Recommended Files

Likely files:

```text
.env.example
services/api/src/config/gemini.ts
services/api/src/config/gemini.test.ts
services/api/package.json
package-lock.json

```

Optional only if useful:

```text
services/api/src/config/index.ts
services/api/src/utils/env.ts

```

Only update other files if necessary for imports, tests, or typecheck.

----------

## Gemini Config Module Requirements

Create a small dependency-free config module.

Example exported types/functions:

```ts
export interface GeminiConfig {
  enabled: boolean;
  apiKeyPresent: boolean;
  model: string;
  timeoutMs: number;
}

export function getGeminiConfig(env?: NodeJS.ProcessEnv): GeminiConfig;

export function assertGeminiReady(config: GeminiConfig): void;

```

Expected behavior:

### When Gemini is disabled

If:

```text
GEMINI_ENABLED=false

```

or missing, config should return:

```ts
enabled: false
apiKeyPresent: false

```

and should not throw.

### When Gemini is enabled and API key is present

If:

```text
GEMINI_ENABLED=true
GEMINI_API_KEY=some-value

```

config should return:

```ts
enabled: true
apiKeyPresent: true

```

and should not expose the actual key.

### When Gemini is enabled and API key is missing

If:

```text
GEMINI_ENABLED=true
GEMINI_API_KEY=

```

`assertGeminiReady` should throw a safe error message such as:

```text
Gemini is enabled but GEMINI_API_KEY is not configured.

```

Do not include the key value in the error.

----------

## Tests Required

Add unit tests for the config helper.

Test at minimum:

1.  Defaults to disabled when env vars are absent.
    
2.  Reads enabled state correctly.
    
3.  Detects API key presence without exposing the key.
    
4.  Uses default model when model env var is absent.
    
5.  Uses default timeout when timeout env var is absent.
    
6.  Parses valid timeout.
    
7.  Falls back safely for invalid timeout.
    
8.  Throws safe error when Gemini is enabled but key is missing.
    
9.  Does not throw when Gemini is disabled.
    

----------

## Existing Behavior Must Remain Unchanged

These endpoints must continue to work exactly as before:

```text
GET /
GET /health
GET /metadata
GET /source-registry
POST /assistant/mock
POST /assistant

```

The `/assistant` endpoint must still return the safe shell response.

Do not make `/assistant` call Gemini.

Do not make `/assistant` depend on Gemini config yet.

----------

## Out of Scope

Do not implement:

-   Gemini SDK installation
    
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
    
-   frontend changes
    
-   assistant UI changes
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source-card UI
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is a config and guardrail task only.
    
-   Do not add runtime dependencies.
    
-   Do not expose secrets.
    
-   Do not log secrets.
    
-   Do not fail local build/test when Gemini is disabled.
    
-   Do not change assistant endpoint behavior.
    
-   Do not change public API response shapes unless absolutely necessary.
    
-   Do not modify unrelated files.
    
-   Keep tests focused and readable.
    
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

```

Also run the API locally:

```powershell
npm run dev:api

```

Manual endpoint checks:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Assistant shell check:

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

-   build passes
    
-   typecheck passes
    
-   all tests pass
    
-   API starts locally
    
-   existing endpoints still work
    
-   `/assistant` still returns safe shell response
    
-   no Gemini call happens
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of Gemini config shell and guardrails
    

### What was intentionally not changed

-   no Gemini calls
    
-   no SDK installation
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no frontend changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   endpoint checks run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues