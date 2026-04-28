# Task 012 — Add Web Component Tests for Metadata, Source Registry Preview, and Mock Assistant Panel

## Status
In Progress

## Branch
test/web-components-task-012

## Goal

Add automated component tests for the existing web shell components.

This task should verify the current React UI behavior for:

- API metadata display
- source registry preview
- mock assistant contract panel

This is a frontend test task only. It must not add new product behavior.

---

## Why

Tasks 001–011 established:

- React + TypeScript web shell
- Cloud Run API shell
- shared contracts
- static source registry metadata
- metadata and source-registry API endpoints
- mock assistant API endpoint
- web metadata/source display
- web mock assistant contract panel
- API route tests

Task 012 should add frontend regression protection before moving toward real assistant UI, source cards, Gemini, or guided journeys.

This improves:

- frontend contract safety
- accessibility confidence
- challenge scoring for testing
- safer future UI refactoring
- confidence that development-only mock assistant behavior remains clearly labeled

---

## In Scope

Add component tests for existing web components.

Recommended coverage:

1. `ApiStatusCard`
2. `SourceRegistryPreview`
3. `MockAssistantContractPanel`
4. Optional: `AssistantResponsePreview` if helpful

The tests should verify rendering behavior, safe labels, loading/error behavior where practical, and contract-based output.

---

## Recommended Test Stack

Use a lightweight React/Vite-compatible setup:

```text
vitest
jsdom
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event

```

Add these as dev dependencies under `apps/web`.

Do not add Cypress, Playwright, browser e2e, MSW, or heavy testing infrastructure in this task.

----------

## Recommended Files

Likely files:

```text
apps/web/package.json
apps/web/vitest.config.ts
apps/web/src/test/setup.ts
apps/web/src/components/ApiStatusCard.test.tsx
apps/web/src/components/SourceRegistryPreview.test.tsx
apps/web/src/components/MockAssistantContractPanel.test.tsx
package-lock.json
package.json

```

Optional if useful:

```text
apps/web/src/components/AssistantResponsePreview.test.tsx

```

Only update other files if necessary for test scripts, imports, or typecheck.

----------

## Required Test Cases

## 1. ApiStatusCard tests

Test that the component:

-   renders app name
    
-   renders tagline
    
-   renders API version
    
-   renders environment
    
-   renders supported language values
    
-   renders supported explanation mode values
    
-   renders generated timestamp or a readable generated field
    

Use a safe mock `AppMetadataResponse`.

Do not depend on a live API.

----------

## 2. SourceRegistryPreview tests

Test that the component:

-   renders source count
    
-   renders source titles
    
-   renders source type
    
-   renders jurisdiction level
    
-   renders freshness status
    
-   does not imply sources are verified when freshness status is `review_due`
    

Use a small mock `SourceRegistryResponse`.

Do not depend on a live API.

----------

## 3. MockAssistantContractPanel tests

Test that the panel:

-   renders the label:
    

```text
Mock Assistant Contract Test

```

-   renders development-only/mock safety messaging
    
-   renders the shared default mock question if used
    
-   renders language selector options:
    
    -   `english`
        
    -   `simple_english`
        
    -   `hinglish`
        
    -   `hindi`
        
-   renders explanation mode selector options:
    
    -   `quick`
        
    -   `simple`
        
    -   `detailed`
        
-   submits a valid request through the existing API client function
    
-   displays returned mock response content
    
-   displays source count as `0` or equivalent safe message
    
-   displays error state if the API client rejects
    

Mock the API client function in tests. Do not call the live API.

----------

## 4. AssistantResponsePreview tests, optional

If this component exists and is easy to test, verify it:

-   renders response status
    
-   renders answer blocks
    
-   renders freshness summary
    
-   renders disclaimer
    
-   renders source count
    
-   does not show real source cards for empty mock sources
    

----------

## Out of Scope

Do not implement:

-   new UI features
    
-   assistant chat UI
    
-   real assistant behavior
    
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
    
-   browser/e2e tests
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   final source-card UI
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   This is a test-focused task.
    
-   Do not change product behavior.
    
-   Do not change public API behavior.
    
-   Do not redesign UI.
    
-   Do not add new visible features.
    
-   Keep dependencies limited to test dev dependencies.
    
-   Tests should be readable and focused on current behavior.
    
-   Prefer accessible queries such as labels, roles, and text.
    
-   Do not rely on a live API in component tests.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Minimal UI Adjustments Allowed

If a component is difficult to test because form labels are missing, you may add small accessibility improvements such as:

-   `aria-label`
    
-   `htmlFor` / `id`
    
-   clearer button text
    
-   accessible status region
    

Only make these changes if needed for testing and accessibility.

Do not visually redesign the UI.

----------

## Verification Required

Run:

```powershell
npm install
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web

```

Also run existing API tests if root `npm test` does not already cover them:

```powershell
npm test --workspace=@voteready/api

```

Manual browser smoke check:

```powershell
npm run dev:api
npm run dev:web

```

Open:

```text
http://localhost:3000

```

Expected:

-   web app still loads
    
-   metadata display still appears
    
-   source registry preview still appears
    
-   mock assistant contract panel still appears
    
-   no real election guidance appears
    
-   web component tests pass
    
-   API tests still pass
    
-   root build passes
    
-   root typecheck passes
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of web test setup and component coverage
    

### What was intentionally not changed

-   no UI behavior change
    
-   no assistant chat UI
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no guided journeys
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks if completed
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
