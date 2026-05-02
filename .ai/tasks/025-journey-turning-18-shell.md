# Task 025 — Add First Guided Journey Detail: Turning 18 Soon

## Status
In Progress

## Branch
feat/journey-turning-18-shell-task-025

## Goal

Add the first guided journey detail shell for:

```text
Turning 18 soon

```

This task should create a safe, source-pending detail experience for the journey without adding procedural election guidance.

This is a frontend journey-detail shell task only.

----------

## Why

Tasks 001–024 established:

-   web app shell
    
-   Cloud Run API shell
    
-   shared contracts
    
-   assistant endpoint
    
-   assistant-first UI shell
    
-   safe source metadata cards
    
-   cannot-verify and neutral-refusal states
    
-   guided journey chooser shell
    

Task 025 should add the first journey detail shell so the product begins to show how future “What applies to me?” journeys will work.

The detail view must remain clearly source-pending until reviewed source-backed content is connected.

----------

## In Scope

Add a safe detail shell for the `Turning 18 soon` journey.

The detail shell should show:

1.  Journey title:
    

```text
Turning 18 soon

```

2.  Clear source-pending status:
    

```text
Source-backed guidance pending

```

3.  Safety note:
    

```text
This journey is not active yet. Reviewed source content must be connected before step-by-step guidance is shown.

```

4.  Placeholder sections that show future structure without giving instructions.
    

Suggested placeholder sections:

```text
Current status
What this journey will help with
Source-backed steps pending
What comes next

```

5.  A visible back action to return to the journey chooser.
    
6.  No real guidance, steps, dates, forms, or eligibility rules.
    

----------

## Recommended Files

Likely files:

```text
apps/web/src/components/GuidedJourneyChooser.tsx
apps/web/src/components/GuidedJourneyChooser.test.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/components/GuidedJourneyDetail.tsx
apps/web/src/components/GuidedJourneyDetail.test.tsx

```

If a separate detail component keeps the code cleaner, create it.

Only modify shared journey metadata if necessary.

----------

## Required Detail Copy

Use safe wording such as:

```text
This Turning 18 soon journey is a placeholder shell.

```

```text
Future tasks will connect reviewed official source content before showing step-by-step guidance.

```

```text
No current registration, eligibility, form, or deadline guidance is active in this shell.

```

Avoid wording that sounds like active procedural guidance.

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
go to this portal
submit this document

```

Do not imply:

-   users can register now
    
-   users are eligible or not eligible
    
-   a specific form applies
    
-   a specific date matters
    
-   a specific official workflow is active in the app
    

----------

## Interaction Behavior

When a user selects the `Turning 18 soon` card:

-   show the dedicated detail shell for that journey
    
-   show the safe placeholder sections
    
-   show the source-pending status
    
-   show a back button/link
    

For other journey cards:

-   preserve the current placeholder behavior from Task 024
    
-   do not build separate detail pages for them yet
    

----------

## Tests Required

Update or add tests.

Test that:

1.  The journey chooser still renders all six cards.
    
2.  Selecting `Turning 18 soon` opens the new detail shell.
    
3.  The detail shell title renders.
    
4.  The source-pending status renders.
    
5.  The safety note renders.
    
6.  Placeholder section headings render.
    
7.  Back action returns to the chooser.
    
8.  Other journey cards still show the generic placeholder behavior.
    
9.  No forbidden procedural terms appear in the detail shell.
    

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

```

----------

## Out of Scope

Do not implement:

-   active journey steps
    
-   source-backed journey content
    
-   journey-specific API endpoints
    
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
    
-   real registration guidance
    
-   eligibility rules
    
-   form instructions
    
-   dates or deadlines
    
-   polling instructions
    
-   state-specific or constituency-specific guidance
    
-   full Stitch screen implementation
    

----------

## Constraints

-   This is a frontend shell task.
    
-   Do not change API behavior.
    
-   Do not add dependencies.
    
-   Do not remove existing assistant behavior.
    
-   Do not weaken safety labels.
    
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
    
-   guided journey chooser appears
    
-   all six journey cards appear
    
-   selecting `Turning 18 soon` opens the dedicated safe detail shell
    
-   back action returns to chooser
    
-   other journeys still show generic placeholder behavior
    
-   metadata display still works
    
-   source registry preview still works
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Turning 18 soon journey detail shell
    

### What was intentionally not changed

-   no active journey steps
    
-   no source-backed journey content
    
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
