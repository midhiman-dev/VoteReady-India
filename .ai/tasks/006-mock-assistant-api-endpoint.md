# Task 006 — Add Mock Assistant API Endpoint

## Status
In Progress

## Branch
feat/mock-assistant-api-task-006

## Goal

Add a safe mock assistant endpoint to the Cloud Run API shell.

This task should prove that the backend can accept an assistant-style request and return a response using the shared `AssistantRequest` and `AssistantResponse` contracts.

This is still not a Gemini implementation task and must not generate real election guidance.

---

## Why

Tasks 001–005 created:

- React + TypeScript web shell
- Cloud Run API shell
- shared app/source/assistant contracts
- static source registry seed metadata
- API metadata and source-registry endpoints
- web display of backend-owned metadata

Task 006 should add the first assistant-shaped backend contract path so future tasks can connect the web UI to an assistant endpoint before adding Gemini or source-grounded orchestration.

This supports:

- backend contract readiness
- Cloud Run usage credibility
- future Gemini integration
- future source-backed answer flow
- safer incremental development

---

## In Scope

Add a mock endpoint to the API service:

```text
POST /assistant/mock

```

The endpoint should:

1.  Accept a JSON body matching the existing shared `AssistantRequest` shape.
    
2.  Return a JSON response matching the existing shared `AssistantResponse` shape.
    
3.  Use safe mock content only.
    
4.  Clearly state that real source-backed guidance is not implemented yet.
    
5.  Avoid procedural election guidance.
    
6.  Avoid dates, deadlines, form instructions, eligibility rules, or political recommendations.
    

----------

## Recommended Files

Likely files:

```text
services/api/src/server.ts

```

Optional if useful:

```text
services/api/src/routes/assistantMock.ts
services/api/src/utils/createMockAssistantResponse.ts

```

Keep the structure simple. Do not over-engineer route organization yet unless `server.ts` is becoming hard to read.

----------

## Mock Endpoint Contract

### Request

Use the existing shared type:

```ts
AssistantRequest

```

Example JSON request:

```json
{
  "question": "How do I understand voting basics?",
  "language": "simple_english",
  "explanationMode": "simple"
}

```

### Response

Use the existing shared type:

```ts
AssistantResponse

```

The response may look like this conceptually:

```json
{
  "id": "mock-2026-04-26T00:00:00.000Z",
  "status": "cannot_verify",
  "language": "simple_english",
  "explanationMode": "simple",
  "answerBlocks": [
    {
      "type": "short_answer",
      "heading": "Mock assistant endpoint",
      "content": "The assistant API contract is connected. Real source-backed election guidance will be added in a later task."
    },
    {
      "type": "source_note",
      "heading": "Source status",
      "content": "No procedural answer has been generated. This response is only a safe contract test."
    }
  ],
  "sources": [],
  "generatedAt": "2026-04-26T00:00:00.000Z",
  "freshnessSummary": {
    "status": "review_due",
    "message": "Source-backed guidance is not active in this mock endpoint."
  },
  "disclaimer": "This is a mock response for development only."
}

```

Important:

-   Do not include real voting instructions.
    
-   Do not use real procedural source content.
    
-   Do not claim the assistant has verified the user’s question.
    
-   Do not mark the response as source-backed.
    

----------

## Minimal Validation

Add simple dependency-free request validation.

Return a `400` response if:

-   request body is missing
    
-   `question` is missing or not a string
    
-   `language` is missing or unsupported
    
-   `explanationMode` is missing or unsupported
    

Do not add a validation library in this task.

Error response can be simple, for example:

```json
{
  "error": "Invalid assistant mock request."
}

```

----------

## Supported Values

Use the same values defined in shared contracts.

Languages:

```text
english
simple_english
hinglish
hindi

```

Explanation modes:

```text
quick
simple
detailed

```

Do not invent new values.

----------

## Out of Scope

Do not implement:

-   Gemini integration
    
-   real assistant orchestration
    
-   prompt construction
    
-   source retrieval
    
-   source ranking
    
-   source grounding
    
-   source ingestion
    
-   scraping
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   web assistant UI
    
-   chat input
    
-   guided journeys
    
-   reminders
    
-   saved guidance
    
-   final source cards
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    
-   political recommendation handling beyond safe mock wording
    

----------

## Constraints

-   Keep this task API-focused.
    
-   Keep the response deterministic and safe.
    
-   Use shared contracts where practical.
    
-   Do not add dependencies.
    
-   Do not expose secrets.
    
-   Do not modify unrelated files.
    
-   Keep build and typecheck passing.
    
-   Preserve existing endpoints:
    
    -   `GET /health`
        
    -   `GET /metadata`
        
    -   `GET /source-registry`
        

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm run dev:api

```

Manual checks:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/metadata
Invoke-RestMethod http://localhost:8080/source-registry

```

Mock assistant endpoint check:

```powershell
$body = @{
  question = "How do I understand voting basics?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body $body

```

Invalid request check:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant/mock `
  -ContentType "application/json" `
  -Body "{}"

```

Expected:

-   API starts successfully
    
-   existing endpoints still work
    
-   valid mock assistant request returns an `AssistantResponse`-shaped JSON object
    
-   invalid request returns a `400` response
    
-   no real guidance content appears
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of mock assistant API endpoint
    

### What was intentionally not changed

-   no Gemini
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no web assistant UI
    
-   no procedural election guidance
    
-   no exact dates or deadline claims
    

### Verification performed

-   commands run
    
-   endpoint checks run
    
-   valid and invalid request checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
