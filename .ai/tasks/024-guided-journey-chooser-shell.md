# Task 024 — Add Guided Journey Chooser Shell

## Status
In Progress

## Branch
feat/guided-journey-chooser-task-024

## Goal

Add a safe Guided Journey Chooser shell to the VoteReady India web app.

The chooser should introduce journey entry points such as:

- First-time voter
- Turning 18 soon
- Moved recently
- Name missing from voter list
- Polling-day help
- Election basics

This task must not provide procedural election guidance yet.

This is a UI shell task only.

---

## Why

Tasks 001–023 established:

- web app shell
- Cloud Run API shell
- shared contracts
- assistant endpoint
- assistant-first UI shell
- safe assistant states
- source metadata cards
- cannot-verify and neutral-refusal behavior

The next product layer is the “What applies to me?” guided journey chooser.

The chooser helps users discover relevant civic education paths, but until verified source-backed journey content exists, each journey must remain clearly marked as a placeholder/shell.

---

## In Scope

Add a guided journey chooser component to the web app.

The component should:

1. Render a section titled something like:

```text
What applies to me?

```

2.  Show safe journey cards for:
    

```text
First-time voter
Turning 18 soon
Moved recently
Name missing from voter list
Polling-day help
Election basics

```

3.  Each card should include:
    
    -   title
        
    -   short safe description
        
    -   status label such as `Coming soon` or `Source-backed flow pending`
        
    -   clear note that verified journey guidance is not active yet
        
4.  Add a simple click/select behavior:
    
    -   selecting a journey may show a placeholder panel
        
    -   placeholder must say source-backed journey guidance is not active yet
        
5.  Preserve existing:
    
    -   assistant shell
        
    -   metadata display
        
    -   source registry preview
        
    -   source cards
        
    -   tests
        

----------

## Recommended Files

Likely files:

```text
apps/web/src/components/GuidedJourneyChooser.tsx
apps/web/src/components/GuidedJourneyChooser.test.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional only if useful:

```text
packages/shared/src/guidedJourneys.ts
packages/shared/src/index.ts

```

If journey metadata is useful across future API/web tasks, add it in `packages/shared`.

Keep it small.

----------

## Suggested Shared Journey Contract

If using shared metadata, add something like:

```ts
export type GuidedJourneyId =
  | "first_time_voter"
  | "turning_18_soon"
  | "moved_recently"
  | "name_missing"
  | "polling_day_help"
  | "election_basics";

export interface GuidedJourneySummary {
  id: GuidedJourneyId;
  title: string;
  shortDescription: string;
  status: "shell_only" | "source_backed_pending";
}

```

Suggested constants:

```ts
export const GUIDED_JOURNEY_SUMMARIES: readonly GuidedJourneySummary[] = [
  // safe metadata only
];

```

Do not add actual journey steps yet.

----------

## Safe Journey Copy Rules

Allowed:

```text
This journey will help users understand what may apply to them once verified source-backed content is connected.

```

```text
Source-backed journey guidance is not active yet.

```

```text
This is a placeholder journey shell for future civic education flow.

```

Not allowed:

```text
Use Form 6 to register.
Register before X date.
You are eligible if...
Go to this polling booth.
Submit these documents.

```

----------

## Required UI Messaging

The chooser should include a clear safety note such as:

```text
These journey cards are navigation shells only. Verified source-backed journey guidance is not active yet.

```

When a journey is selected, show a safe placeholder such as:

```text
This journey is not active yet. Future tasks will connect reviewed source content before showing step-by-step guidance.

```

----------

## Placement in App

Recommended page order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  Guided journey chooser
    
4.  API metadata
    
5.  Source registry preview
    

Do not remove the assistant shell.

The assistant remains the primary product surface.

----------

## Tests Required

Add tests for `GuidedJourneyChooser`.

Test that:

1.  The section heading renders.
    
2.  All six journey cards render.
    
3.  The safety note renders.
    
4.  Each card shows a pending/shell status.
    
5.  Selecting a journey shows a placeholder panel.
    
6.  Placeholder says verified source-backed journey guidance is not active yet.
    
7.  No procedural election guidance appears.
    

Unsafe procedural terms to avoid in rendered text:

```text
deadline
Form 6
eligible
eligibility
polling date
register by
voter ID required

```

Update app/component tests only as needed.

----------

## Out of Scope

Do not implement:

-   journey detail pages
    
-   real journey steps
    
-   source-backed journey content
    
-   source retrieval
    
-   source grounding generation
    
-   Gemini
    
-   model calls
    
-   prompt construction
    
-   Firestore
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   saved journey progress
    
-   reminders
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    
-   full Stitch screen implementation
    

----------

## Constraints

-   This is a frontend shell task.
    
-   Do not change API behavior.
    
-   Do not add dependencies.
    
-   Do not remove existing assistant behavior.
    
-   Keep copy neutral and safe.
    
-   Do not imply journeys are active.
    
-   Do not provide voting instructions.
    
-   Keep build, typecheck, and tests passing.
    

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
    
-   guided journey chooser appears
    
-   all six journey cards appear
    
-   selecting a journey shows safe placeholder text
    
-   metadata display still works
    
-   source registry preview still works
    
-   no real election guidance appears
    
-   all tests pass
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of guided journey chooser shell
    

### What was intentionally not changed

-   no journey guidance
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding generation
    
-   no Firebase/Firestore
    
-   no saved progress
    
-   no reminders
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
