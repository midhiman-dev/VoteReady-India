# Task 026 — Add Election Basics Explainer Shell

## Status
In Progress

## Branch
feat/election-basics-shell-task-026

## Goal

Add a safe Election Basics Explainer shell to the VoteReady India web app.

This task should introduce a structured placeholder explainer for basic civic/election concepts, but it must not provide actual election process guidance yet.

This is a frontend explainer-shell task only.

---

## Why

Tasks 001–025 established:

- web app shell
- Cloud Run API shell
- shared contracts
- assistant endpoint
- assistant-first UI shell
- safe source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser shell
- Turning 18 soon journey detail shell

The next supporting product layer is an Election Basics explainer area.

This helps users see that VoteReady India will eventually explain key civic concepts in simple language, while keeping the current build safe until reviewed source-backed content is connected.

---

## In Scope

Add an Election Basics Explainer shell to the web app.

The shell should show safe placeholder topics such as:

```text
How voting works
Election types
Electoral rolls
Constituency basics
Polling-day flow
Official sources

```

Each topic should be marked as source-backed content pending.

The shell should clearly state:

```text
Election basics explainers are not active yet. Reviewed official source content must be connected before explanations are shown.

```

----------

## Recommended Files

Likely files:

```text
apps/web/src/components/ElectionBasicsExplainer.tsx
apps/web/src/components/ElectionBasicsExplainer.test.tsx
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional only if useful:

```text
packages/shared/src/electionBasics.ts
packages/shared/src/index.ts

```

If shared topic metadata is useful, add it to `packages/shared`. Keep it small and safe.

----------

## Suggested Shared Contract

If using shared metadata, add something like:

```ts
export type ElectionBasicsTopicId =
  | "how_voting_works"
  | "election_types"
  | "electoral_rolls"
  | "constituency_basics"
  | "polling_day_flow"
  | "official_sources";

export interface ElectionBasicsTopicSummary {
  id: ElectionBasicsTopicId;
  title: string;
  shortDescription: string;
  status: "source_backed_pending";
}

export const ELECTION_BASICS_TOPICS: readonly ElectionBasicsTopicSummary[] = [
  // safe metadata only
];

```

Do not add actual explanations yet.

----------

## Safe Topic Copy Rules

Allowed:

```text
This topic will explain the concept once reviewed official source content is connected.

```

```text
Source-backed explanation pending.

```

```text
This is a placeholder explainer shell for future civic education content.

```

Not allowed:

```text
You must do X before voting.
Carry this document.
Register using this form.
You are eligible if...
The deadline is...
Polling happens on...

```

----------

## Required UI Behavior

Add a section titled:

```text
Election Basics

```

or:

```text
Election Basics Explained

```

The section should include:

1.  A safety note that explainers are source-pending.
    
2.  Six topic cards.
    
3.  Each card should have:
    
    -   title
        
    -   short safe description
        
    -   status label such as `Source-backed explanation pending`
        
4.  Selecting a topic may show a placeholder detail panel.
    
5.  The placeholder detail panel must say reviewed source content is required before explanations are shown.
    
6.  A back action should return to the topic grid if a detail panel is shown.
    

----------

## Placement in App

Recommended page order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  Guided journey chooser
    
4.  Election Basics Explainer shell
    
5.  API metadata
    
6.  Source registry preview
    

Do not remove or weaken the assistant shell.

----------

## Forbidden Content

Do not include:

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

Do not imply:

-   users can follow any active election process in the app
    
-   a form applies to them
    
-   a deadline applies to them
    
-   a document is required
    
-   polling-day instructions are available
    
-   current official guidance is already connected
    

----------

## Tests Required

Add tests for the Election Basics shell.

Test that:

1.  The explainer heading renders.
    
2.  The source-pending safety note renders.
    
3.  All six topic cards render.
    
4.  Each card shows pending/source-backed status.
    
5.  Selecting a topic shows a safe placeholder panel.
    
6.  Back action returns to topic grid.
    
7.  No forbidden procedural terms appear.
    
8.  Existing assistant shell and guided journey tests still pass.
    

Forbidden terms to check:

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

-   real election basics explanations
    
-   active topic detail content
    
-   source-backed explanation content
    
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
    
-   saved progress
    
-   reminders
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, document instructions, or state-specific guidance
    
-   full Stitch screen implementation
    

----------

## Constraints

-   This is a frontend shell task.
    
-   Do not change API behavior.
    
-   Do not add dependencies.
    
-   Do not remove existing assistant or journey behavior.
    
-   Keep copy neutral, safe, and source-pending.
    
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
    
-   guided journey chooser still works
    
-   Turning 18 soon detail shell still works
    
-   Election Basics shell appears
    
-   all six topic cards appear
    
-   selecting a topic shows safe placeholder text
    
-   back action returns to topic grid
    
-   metadata display still works
    
-   source registry preview still works
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Election Basics Explainer shell
    

### What was intentionally not changed

-   no real explainer content
    
-   no source-backed explanation content
    
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
