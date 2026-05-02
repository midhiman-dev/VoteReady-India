# Task 027 — Add Saved Guidance Local-First Shell

## Status
In Progress

## Branch
feat/saved-guidance-local-shell-task-027

## Goal

Add a local-first Saved Guidance shell to the VoteReady India web app.

Users should be able to save safe assistant responses locally in the browser and view them in a simple saved guidance panel.

This task must not add Firebase, Auth, Firestore, backend persistence, accounts, or real user profile behavior.

This is a frontend local-storage shell task only.

---

## Why

Tasks 001–026 established:

- web app shell
- Cloud Run API shell
- shared contracts
- assistant endpoint
- assistant-first UI shell
- source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser shell
- Turning 18 soon journey detail shell
- Election Basics explainer shell

The next useful product shell is “Saved Guidance”.

In the final product, users may want to save answers or guidance for later. But before Auth/Firestore/Firebase are introduced, the app should support a safe local-only shell.

This supports:

- demo completeness
- future saved guidance workflow
- future Firebase/Auth integration
- user-centered product flow
- safe incremental development

---

## In Scope

Add a Saved Guidance local-first shell to the web app.

The app should allow:

1. Saving the current assistant response locally.
2. Viewing saved items in a Saved Guidance section.
3. Removing saved items locally.
4. Clearing all saved items locally.
5. Displaying a clear local-only safety note.
6. Preserving existing assistant, journey, election basics, metadata, and source registry behavior.

---

## Recommended Files

Likely files:

```text
apps/web/src/components/SavedGuidancePanel.tsx
apps/web/src/components/SavedGuidancePanel.test.tsx
apps/web/src/components/AssistantShell.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/lib/savedGuidanceStorage.ts
apps/web/src/lib/savedGuidanceStorage.test.ts
packages/shared/src/savedGuidance.ts
packages/shared/src/index.ts

```

If shared types are useful, add them in `packages/shared`.

Keep the implementation small.

----------

## Suggested Shared Contract

If adding a shared type, use something like:

```ts
export interface SavedGuidanceItem {
  id: string;
  question: string;
  responseStatus: AssistantAnswerStatus;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  savedAt: IsoDateTimeString;
  responseSummary: string;
  sourceCount: number;
  localOnly: true;
}

```

Keep it metadata-oriented. Do not store sensitive user data.

----------

## Local Storage Behavior

Use browser `localStorage`.

Suggested key:

```text
voteready.savedGuidance.v1

```

Requirements:

-   Save only safe assistant response metadata and a short response summary.
    
-   Do not store secrets.
    
-   Do not store auth tokens.
    
-   Do not store precise location.
    
-   Do not store personal identity data.
    
-   Do not require login.
    
-   Handle invalid/corrupt localStorage data gracefully.
    
-   If localStorage is unavailable, show a clear error or fallback message.
    

----------

## Assistant Save Behavior

When an assistant response is displayed:

-   show a button such as:
    

```text
Save locally

```

or:

```text
Save this response

```

Clicking the button should save a local item.

Saved item should include:

-   question text
    
-   response status
    
-   language
    
-   explanation mode
    
-   saved timestamp
    
-   short response summary
    
-   source count
    
-   local-only marker
    

Do not save full source content or any personal data.

----------

## Saved Guidance Panel Behavior

Add a section titled:

```text
Saved Guidance

```

It should show:

-   local-only safety note
    
-   empty state when no items are saved
    
-   list of saved items
    
-   saved timestamp
    
-   question
    
-   response status
    
-   source count
    
-   remove item action
    
-   clear all action when items exist
    

Safety note example:

```text
Saved guidance is stored only in this browser for now. It is not synced, verified, or connected to an account.

```

Also include:

```text
Saved items are reminders of previous safe assistant responses, not verified procedural guidance.

```

----------

## Placement in App

Recommended page order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  Saved Guidance panel
    
4.  Guided Journey chooser
    
5.  Election Basics explainer shell
    
6.  API metadata
    
7.  Source registry preview
    

Do not remove or weaken the assistant shell.

----------

## Tests Required

Add tests for saved guidance behavior.

Test at minimum:

1.  Saved Guidance panel heading renders.
    
2.  Local-only safety note renders.
    
3.  Empty state renders when no items exist.
    
4.  Saving an assistant response creates a saved item.
    
5.  Saved item displays question, status, timestamp, and source count.
    
6.  Removing an item removes it from the panel.
    
7.  Clear all removes all saved items.
    
8.  Corrupt localStorage data does not crash the app.
    
9.  No procedural guidance is introduced in saved guidance UI.
    

Forbidden terms to avoid in saved guidance copy:

```text
Form 6
register by
deadline
eligible if
eligibility criteria
advance registration
voter ID required
polling date
submit this document
carry this document
go to this portal

```

----------

## Out of Scope

Do not implement:

-   Firebase
    
-   Firestore
    
-   Auth
    
-   user accounts
    
-   backend saved guidance API
    
-   cloud sync
    
-   cross-device sync
    
-   profile management
    
-   saved journey progress
    
-   reminders
    
-   notifications
    
-   Gemini
    
-   model calls
    
-   source retrieval
    
-   source grounding generation
    
-   real procedural guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, document instructions, or state-specific guidance
    

----------

## Constraints

-   This is a frontend local-only shell task.
    
-   Do not change API behavior.
    
-   Do not add backend routes.
    
-   Do not add Firebase/Auth/Firestore.
    
-   Do not add dependencies unless absolutely necessary.
    
-   Keep saved data minimal and non-sensitive.
    
-   Keep copy neutral, safe, and local-only.
    
-   Keep build, typecheck, and tests passing.
    
-   Preserve existing assistant, journeys, election basics, metadata, and source registry behavior.
    

----------

## Accessibility Expectations

Use:

-   visible labels
    
-   accessible buttons
    
-   clear empty state
    
-   readable saved item cards
    
-   clear local-only notice
    
-   non-color-only status labels
    

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
    
-   assistant shell still works
    
-   after submitting assistant question, save action appears
    
-   saving creates a local saved guidance item
    
-   saved item appears in Saved Guidance panel
    
-   remove item works
    
-   clear all works
    
-   local-only safety note appears
    
-   guided journeys still work
    
-   Election Basics still works
    
-   metadata and source registry preview still work
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Saved Guidance local-first shell
    

### What was intentionally not changed

-   no Firebase
    
-   no Auth
    
-   no Firestore
    
-   no backend persistence
    
-   no accounts
    
-   no saved journey progress
    
-   no reminders
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding generation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
