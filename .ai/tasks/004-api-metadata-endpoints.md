# Task 004 — Add API Health and Metadata Endpoints

## Status
In Progress

## Branch
feat/api-metadata-task-004

## Goal

Add safe read-only metadata endpoints to the Cloud Run API shell.

This task should make the API shell slightly more useful by exposing non-sensitive app metadata and source-registry metadata from the shared package.

This is still not an assistant implementation task.

---

## Why

VoteReady India needs Cloud Run to become a meaningful backend path, not just a placeholder service.

Tasks 001–003 created:

- web app shell
- Cloud Run API shell
- shared app/source/assistant contracts
- static source registry seed metadata

Task 004 should wire the API shell to those shared contracts in a safe, read-only way so future frontend and assistant tasks can consume backend-owned metadata.

This supports:

- source transparency
- freshness visibility
- Cloud Run scoring credibility
- clean separation between UI and backend

---

## In Scope

Update the API service to expose read-only endpoints.

Recommended endpoints:

```text
GET /health
GET /metadata
GET /source-registry

```

### `GET /health`

Keep the existing health endpoint working.

It should return a typed health response using the shared package contract if practical.

Expected shape:

```json
{
  "ok": true,
  "service": "voteready-api",
  "version": "0.1.0",
  "timestamp": "2026-04-26T00:00:00.000Z"
}

```

### `GET /metadata`

Return safe app/backend metadata.

Suggested response fields:

```ts
{
  appName: string;
  tagline: string;
  apiVersion: string;
  environment: string;
  supportedLanguages: LanguagePreference[];
  supportedExplanationModes: ExplanationMode[];
  generatedAt: IsoDateTimeString;
}

```

### `GET /source-registry`

Return the static source registry metadata from `packages/shared`.

This endpoint may return:

```ts
{
  sources: SourceRecord[];
  count: number;
  generatedAt: IsoDateTimeString;
}

```

Important:

-   this endpoint returns metadata only
    
-   no source content
    
-   no election guidance
    
-   no procedural claims
    
-   no scraping or live verification
    

----------

## Recommended Files

Likely files:

```text
services/api/src/server.ts
packages/shared/src/api.ts
packages/shared/src/index.ts

```

Optional if useful:

```text
services/api/src/routes/metadata.ts
services/api/src/routes/sourceRegistry.ts

```

Keep the structure simple. Do not over-engineer route organization if the current API shell is still very small.

----------

## Shared Contracts

If useful, add shared API response contracts such as:

```ts
export interface AppMetadataResponse {
  appName: string;
  tagline: string;
  apiVersion: string;
  environment: AppEnvironment;
  supportedLanguages: readonly LanguagePreference[];
  supportedExplanationModes: readonly ExplanationMode[];
  generatedAt: IsoDateTimeString;
}

export interface SourceRegistryResponse {
  sources: readonly SourceRecord[];
  count: number;
  generatedAt: IsoDateTimeString;
}

```

Do not add runtime validation libraries in this task.

----------

## Out of Scope

Do not implement:

-   assistant endpoint
    
-   Gemini integration
    
-   prompt construction
    
-   response generation
    
-   source retrieval
    
-   scraping
    
-   ingestion
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   admin/source review UI
    
-   frontend API consumption
    
-   guided journeys
    
-   source card UI
    
-   election guidance content
    
-   dates, deadlines, form rules, or eligibility rules
    

----------

## Constraints

-   Keep this task backend/API-focused.
    
-   Use existing shared constants and contracts.
    
-   Preserve existing `/health` behavior.
    
-   Do not add sensitive configuration.
    
-   Do not expose secrets or environment variables beyond a safe environment label.
    
-   Do not introduce new dependencies unless absolutely necessary.
    
-   Keep responses deterministic and easy to test.
    
-   Keep source registry records as metadata only.
    
-   Do not mark sources as verified.
    
-   Do not create user-facing guidance.
    

----------

## Implementation Notes

### Environment handling

Use a safe environment value.

Preferred values should align with the existing shared `AppEnvironment` type:

```ts
"local" | "development" | "staging" | "production"

```

If `NODE_ENV` has incompatible values such as `test`, map it safely or default to `"local"`.

### Metadata values

Use the shared app constants from `packages/shared`.

The endpoint should not duplicate app name/tagline as separate hardcoded strings if shared constants already exist.

### Source registry values

Use `INITIAL_SOURCE_REGISTRY` from the shared package.

Do not mutate it in the API.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api

```

Then manually verify:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Expected:

-   API starts successfully
    
-   `/health` returns OK JSON
    
-   `/metadata` returns app metadata
    
-   `/source-registry` returns source metadata and count
    
-   root build passes
    
-   root typecheck passes
    
-   no product logic added
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of API metadata endpoints
    

### What was intentionally not changed

-   no assistant endpoint
    
-   no Gemini
    
-   no source ingestion
    
-   no Firebase/Firestore
    
-   no UI
    
-   no procedural election guidance
    
-   no exact dates or deadline claims
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
