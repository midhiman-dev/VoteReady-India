# Task 019 — Replace Mock Assistant Panel with Assistant-First UI Shell

## Status
In Progress

## Branch
feat/assistant-ui-shell-task-019

## Goal

Replace the visible mock assistant contract panel in the web app with an assistant-first UI shell that calls the safe `POST /assistant` endpoint.

This task should make the app feel closer to the intended VoteReady India assistant experience while keeping the behavior safe and non-generative.

This is still not a Gemini task.

---

## Why

Tasks 001–018 established:

- web app shell
- Cloud Run API shell
- shared contracts
- source registry metadata
- mock assistant endpoint
- real assistant endpoint shell at `POST /assistant`
- Gemini configuration guardrails
- assistant orchestration skeleton
- safe curated source fragments
- API and web tests

The current web app still exposes a development-style mock assistant contract panel.

Task 019 should shift the visible UI toward the real product direction:

> The assistant is the product.

But because Gemini and real source-grounded guidance are not active yet, the UI must remain transparent and must not imply that it can answer real voting questions.

---

## In Scope

Update the web app to:

1. Add an assistant-first shell component.
2. Call `POST /assistant`, not `POST /assistant/mock`.
3. Use the existing shared `AssistantRequest` and `AssistantResponse` contracts.
4. Preserve language and explanation-mode selectors.
5. Preserve safe loading and error states.
6. Display the safe `AssistantResponse`.
7. Clearly explain that real source-backed election guidance is not active yet.
8. Keep metadata and source registry preview visible, but secondary.
9. Update web tests.

---

## Recommended Files

Likely files:

```text
apps/web/src/lib/apiClient.ts
apps/web/src/components/AssistantShell.tsx
apps/web/src/components/AssistantShell.test.tsx
apps/web/src/components/AssistantResponsePreview.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Existing component that may be removed from visible use:

```text
apps/web/src/components/MockAssistantContractPanel.tsx
apps/web/src/components/MockAssistantContractPanel.test.tsx

```

You may keep the mock component/test if useful for development, but it should no longer be the main visible assistant experience.

Do not remove `POST /assistant/mock` from the API.

----------

## UI Behavior

Add a primary assistant section with a heading such as:

```text
VoteReady Assistant

```

or:

```text
Ask VoteReady

```

Add a safety note near the input:

```text
This assistant shell is connected to the backend, but real source-backed election guidance is not active yet.

```

The UI should include:

-   question textarea
    
-   language selector
    
-   explanation mode selector
    
-   submit button
    
-   loading state
    
-   error state
    
-   response preview
    

Use a safe default question such as:

```text
Can VoteReady India answer questions yet?

```

Do not use a default question that asks for registration steps, deadlines, forms, eligibility, polling dates, or state-specific guidance.

----------

## API Client Requirements

Add or update a client function for the real assistant shell:

```ts
postAssistantRequest(
  request: AssistantRequest
): Promise<AssistantResponse>

```

This should call:

```text
POST /assistant

```

Keep the existing mock client function if it is still used by tests or development-only components.

Do not remove `postMockAssistantRequest` unless the codebase no longer needs it and tests are updated accordingly.

----------

## Response Display Requirements

Use the existing `AssistantResponsePreview` if practical.

The response preview should display:

-   response status
    
-   language
    
-   explanation mode
    
-   answer blocks
    
-   freshness summary
    
-   disclaimer
    
-   source count
    

Because `/assistant` still returns safe shell behavior, the UI must not show source cards as verified procedural guidance.

Use safe labels such as:

```text
Sources returned: 0

```

or:

```text
No verified procedural sources are active for this response yet.

```

----------

## App Layout Expectations

The assistant shell should become the most prominent section of the current web app.

Recommended order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  API metadata
    
4.  Source registry preview
    

The mock assistant contract panel should not be the primary user-facing section anymore.

----------

## Tests Required

Update or add web component tests.

Required test coverage:

### AssistantShell tests

Verify:

-   assistant heading renders
    
-   safety note renders
    
-   safe default question renders
    
-   language selector shows:
    
    -   `english`
        
    -   `simple_english`
        
    -   `hinglish`
        
    -   `hindi`
        
-   explanation mode selector shows:
    
    -   `quick`
        
    -   `simple`
        
    -   `detailed`
        
-   submit calls `postAssistantRequest`, not `postMockAssistantRequest`
    
-   returned safe assistant response is displayed
    
-   source count is shown safely
    
-   error state renders when API call fails
    
-   no procedural election guidance appears
    

### App tests, optional

If there is no App test, do not add one unless simple.

If existing tests reference the mock assistant panel as the primary visible panel, update them to reference the assistant shell instead.

----------

## Out of Scope

Do not implement:

-   Gemini SDK installation
    
-   Gemini API calls
    
-   model calls
    
-   prompt construction
    
-   prompt templates
    
-   real source-grounded generation
    
-   source retrieval
    
-   source search
    
-   source ranking
    
-   source ingestion
    
-   scraping
    
-   embeddings
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source-card UI
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    
-   full Stitch screen implementation
    
-   broad UI redesign
    

----------

## Constraints

-   This is a frontend shell task.
    
-   Do not change API behavior.
    
-   Do not remove `/assistant/mock`.
    
-   Do not add dependencies.
    
-   Use existing shared contracts and supported option constants.
    
-   Keep copy transparent and safe.
    
-   Do not imply the assistant can already answer real election questions.
    
-   Do not modify unrelated files.
    
-   Keep metadata and source registry preview working.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Accessibility Expectations

The assistant shell should use:

-   visible labels
    
-   semantic form controls
    
-   accessible button text
    
-   readable loading/error messages
    
-   clear status/response section
    
-   non-color-only status indicators
    

Minimal accessibility improvements are allowed if needed for tests.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web
npm test --workspace=@voteready/api
npm test --workspace=@voteready/shared

```

Manual smoke check:

```powershell
npm run dev:api
npm run dev:web

```

Open:

```text
http://localhost:3000

```

Expected:

-   web app loads
    
-   assistant shell is visible and prominent
    
-   mock assistant contract panel is no longer the primary visible assistant experience
    
-   submitting the safe default question calls `/assistant`
    
-   response displays safe shell/source-fragment context
    
-   metadata display still works
    
-   source registry preview still works
    
-   no real election guidance appears
    
-   all tests pass
    

Manual API check:

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

-   `/assistant` still returns safe shell response
    
-   no Gemini call happens
    
-   no real source retrieval happens
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of assistant-first UI shell
    

### What was intentionally not changed

-   no Gemini
    
-   no source retrieval
    
-   no source grounding generation
    
-   no API behavior changes
    
-   no Firebase/Firestore
    
-   no guided journeys
    
-   no saved guidance
    
-   no reminders
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
