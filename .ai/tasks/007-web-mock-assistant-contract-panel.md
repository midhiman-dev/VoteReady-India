# Task 007 — Add Web Mock Assistant Client and Contract Test Panel

## Status
In Progress

## Branch
feat/web-mock-assistant-task-007

## Goal

Add a small development-only mock assistant contract panel to the web app.

This task should prove that the React web app can call the Cloud Run API mock assistant endpoint:

```text
POST /assistant/mock

```

The panel must clearly communicate that this is a mock contract test only and not the real VoteReady India assistant.

----------

## Why

Tasks 001–006 created:

-   React + TypeScript web shell
    
-   Cloud Run API shell
    
-   shared source and assistant contracts
    
-   static source registry seed metadata
    
-   API metadata and source-registry endpoints
    
-   web display of backend-owned metadata
    
-   safe mock assistant API endpoint
    

Task 007 connects the web app to the mock assistant API so future tasks can build the real assistant UI and Gemini/source-grounded flow incrementally.

This supports:

-   frontend/backend assistant contract validation
    
-   shared contract usage
    
-   future Gemini integration readiness
    
-   safer incremental development
    
-   Cloud Run backend path visibility
    

----------

## In Scope

Update the web app to:

1.  Add a web API client function for `POST /assistant/mock`.
    
2.  Use shared `AssistantRequest` and `AssistantResponse` contracts.
    
3.  Add a clearly labeled mock assistant contract test panel.
    
4.  Allow a user/developer to submit a test question to the mock endpoint.
    
5.  Allow language selection using existing shared supported values.
    
6.  Allow explanation mode selection using existing shared supported values.
    
7.  Display the returned mock `AssistantResponse`.
    
8.  Display loading and error states.
    
9.  Preserve the existing metadata and source registry preview from Task 005.
    

----------

## Recommended Files

Likely files:

```text
apps/web/src/lib/apiClient.ts
apps/web/src/components/MockAssistantContractPanel.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/components/AssistantResponsePreview.tsx

```

Keep this small. Do not overbuild the real assistant UI yet.

----------

## Required UI Behavior

Add a compact section labeled clearly as:

```text
Mock Assistant Contract Test

```

It should include a visible note such as:

```text
This is a development-only mock endpoint. It does not provide real election guidance yet.

```

The panel should include:

-   question text input or textarea
    
-   language selector
    
-   explanation mode selector
    
-   submit button
    
-   loading state
    
-   error state
    
-   response preview
    

Default test question should be safe and non-procedural, for example:

```text
Can you confirm the assistant contract is connected?

```

Do not use default text that asks for real election instructions, registration steps, deadlines, eligibility, forms, or polling details.

----------

## API Client Requirements

Add a dependency-free API client function.

Suggested function:

```ts
postMockAssistantRequest(
  request: AssistantRequest
): Promise<AssistantResponse>

```

Use existing API base URL handling from Task 005.

Do not add Axios, React Query, SWR, or any new dependency.

----------

## Response Preview Requirements

Display the response in a simple, readable way:

-   response status
    
-   language
    
-   explanation mode
    
-   generated timestamp
    
-   answer blocks
    
-   freshness summary if present
    
-   disclaimer if present
    
-   source count
    

Since the mock endpoint should return no real sources, the UI should not display source cards as if real guidance is available.

Use safe wording such as:

```text
Sources returned: 0

```

Do not imply that guidance has been verified.

----------

## Out of Scope

Do not implement:

-   real assistant chat UI
    
-   Gemini integration
    
-   prompt construction
    
-   assistant orchestration
    
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
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source-card UI
    
-   multilingual translation behavior
    
-   Stitch screen implementation
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    
-   political recommendation handling beyond mock/development-safe wording
    

----------

## Constraints

-   Keep this task web/API-contract focused.
    
-   Use shared contracts where practical.
    
-   Do not add dependencies.
    
-   Do not modify unrelated files.
    
-   Preserve existing web metadata display.
    
-   Keep UI copy neutral and safe.
    
-   Clearly label the panel as mock/development-only.
    
-   Do not imply the assistant is real or source-backed yet.
    
-   Keep build and typecheck passing.
    

----------

## Accessibility Expectations

The panel should use:

-   readable labels
    
-   semantic form controls
    
-   clear loading state
    
-   clear error message
    
-   accessible button text
    
-   readable response output
    

Do not spend this task on visual polish beyond clarity.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api
npm run dev:web

```

Manual API check:

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

Browser check:

Open:

```text
http://localhost:3000

```

Expected:

-   web app loads
    
-   existing metadata section still appears
    
-   existing source registry preview still appears
    
-   mock assistant contract panel appears
    
-   submitting the default test question returns a mock response
    
-   loading state appears during request
    
-   error state appears if API is stopped
    
-   UI clearly says this is mock/development-only
    
-   no real election guidance appears
    
-   no dates, deadlines, form instructions, eligibility rules, or polling guidance appear
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of web mock assistant client and contract panel
    

### What was intentionally not changed

-   no real assistant UI
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no guided journeys
    
-   no saved guidance
    
-   no reminders
    
-   no procedural election guidance
    
-   no exact dates or deadline claims
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   browser/manual checks completed
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues