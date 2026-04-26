# Task 005 — Add Web API Client and Metadata Display Shell

## Status
In Progress

## Branch
feat/web-metadata-task-005

## Goal

Add a small web API client in `apps/web` and display safe backend-owned metadata from the Cloud Run API shell.

This task should prove that the React web app can call the API and render read-only metadata from:

- `GET /metadata`
- `GET /source-registry`

This is still not an assistant implementation task.

---

## Why

Tasks 001–004 created:

- React + TypeScript web shell
- Cloud Run API shell
- shared source and assistant contracts
- static source registry seed metadata
- API metadata and source-registry endpoints

Task 005 connects the web shell to the API in a minimal, safe, read-only way.

This supports:

- Cloud Run usage credibility
- source transparency
- frontend/backend integration readiness
- future source-card and assistant UI work
- clean separation between UI and backend-owned metadata

---

## In Scope

Update the web app to:

1. Read an API base URL from environment config.
2. Add a small API client.
3. Fetch `/metadata`.
4. Fetch `/source-registry`.
5. Display the returned metadata in the current web shell.
6. Show basic loading and error states.
7. Keep the UI simple and accessible.

---

## Recommended Files

Likely files:

```text
apps/web/.env.example
apps/web/src/lib/apiClient.ts
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/components/ApiStatusCard.tsx
apps/web/src/components/SourceRegistryPreview.tsx
apps/web/src/types.ts

```

Keep structure simple. Do not over-componentize yet.

----------

## Environment Configuration

Add a Vite environment variable for the API base URL:

```text
VITE_API_BASE_URL=http://localhost:8080

```

If `apps/web/.env.example` does not exist, create it.

The app should default safely to:

```text
http://localhost:8080

```

when the variable is not set.

----------

## Required Web Behavior

The web shell should display:

### 1. Existing brand shell

Preserve:

-   VoteReady India
    
-   Ask. Understand. Be vote-ready.
    

### 2. API metadata section

Display safe metadata from `/metadata`, such as:

-   app name
    
-   tagline
    
-   API version
    
-   environment
    
-   supported languages
    
-   supported explanation modes
    
-   generated timestamp
    

### 3. Source registry preview

Display a simple source registry summary from `/source-registry`, such as:

-   source count
    
-   source title
    
-   source type
    
-   freshness status
    
-   jurisdiction level
    

Important:  
This is only metadata preview. Do not present these as verified guidance.

### 4. Loading state

Show a clear loading message while API data is loading.

### 5. Error state

Show a clear non-technical error message if the API is not reachable.

Example:

```text
Unable to reach the API metadata service. Start the API locally and try again.

```

----------

## API Client Requirements

Add a small dependency-free API client.

Suggested functions:

```ts
getAppMetadata(): Promise<AppMetadataResponse>
getSourceRegistry(): Promise<SourceRegistryResponse>

```

Use shared response contracts from `packages/shared` where available.

Handle failed responses cleanly.

Do not add React Query, SWR, Axios, or other data-fetching dependencies in this task.

----------

## CORS / Local Dev Note

If the browser cannot call `http://localhost:8080` from Vite due to CORS, apply the smallest safe fix.

Preferred options:

1.  Add minimal CORS headers in the API shell for local development, or
    
2.  Add a Vite dev proxy.
    

Do not introduce a large CORS package unless necessary.

If adding CORS handling, keep it generic, minimal, and safe.

----------

## Out of Scope

Do not implement:

-   assistant chat UI
    
-   Gemini integration
    
-   prompt construction
    
-   assistant response generation
    
-   source retrieval
    
-   source scraping
    
-   source ingestion
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   guided journeys
    
-   source card UI as final product
    
-   saved guidance
    
-   reminders
    
-   election guidance content
    
-   exact dates, deadlines, form rules, or eligibility rules
    
-   Hindi/Hinglish translation behavior
    
-   Stitch screen implementation
    

----------

## Constraints

-   Keep this task frontend/API-integration focused.
    
-   Do not add product logic.
    
-   Do not add new dependencies unless strongly justified.
    
-   Use existing shared contracts where practical.
    
-   Preserve existing app shell.
    
-   Keep UI copy neutral and safe.
    
-   Do not imply the app can already answer voting questions.
    
-   Do not imply source records are verified.
    
-   Do not modify unrelated files.
    
-   Keep build and typecheck passing.
    

----------

## Accessibility Expectations

The metadata display should use:

-   readable text
    
-   clear headings
    
-   non-color-only freshness labels
    
-   sensible loading and error messages
    
-   semantic HTML where practical
    

Do not spend this task on visual polish.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api
npm run dev:web

```

Manual checks:

```powershell
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Browser check:

Open:

```text
http://localhost:3000

```

Expected:

-   web app loads
    
-   API metadata appears
    
-   source registry summary appears
    
-   loading state is visible briefly or handled correctly
    
-   API error state appears if the API is stopped
    
-   no assistant or election guidance content appears
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of web API client and metadata display
    

### What was intentionally not changed

-   no assistant chat
    
-   no Gemini
    
-   no source ingestion
    
-   no Firebase/Firestore
    
-   no final source-card UI
    
-   no guided journeys
    
-   no procedural election guidance
    
-   no exact dates or deadline claims
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   browser/manual checks completed
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
