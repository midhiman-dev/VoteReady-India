# Task 035 — Final Stabilization, README Update, and Submission Readiness Pass

## Status
In Progress

## Branch
chore/final-stabilization-task-035

## Goal

Perform the final stabilization and submission-readiness pass for the VoteReady India MVP safe-shell build.

This task should verify the repo, polish documentation, update final README/demo notes, and ensure the project is ready for submission review.

This is a stabilization/documentation/QA task only.

---

## In Scope

Perform a final pass over:

- README accuracy
- local setup instructions
- demo flow instructions
- safety boundary documentation
- known limitations
- test command documentation
- environment variable documentation
- final validation evidence
- formatting/typo cleanup in docs
- final automated verification

---

## Recommended Files

Likely files:

```text
README.md
docs/testing/demo-checklist.md
docs/release-notes/mvp-demo-validation.md
docs/handover/known-limitations.md
docs/security/app-check.md
.env.example
apps/web/.env.example

```

Optional only if needed:

```text
docs/release-notes/final-submission-readiness.md

```

Do not modify app behavior unless there is a tiny typo/import/docs-only issue that blocks build/test.

----------

## README Must Clearly Include

-   Project name: VoteReady India
    
-   Tagline: Ask. Understand. Be vote-ready.
    
-   Safe-shell architecture summary
    
-   What is active
    
-   What is intentionally inactive
    
-   How to run locally
    
-   How to run tests
    
-   Demo flow
    
-   Safety boundaries
    
-   Environment setup notes
    
-   No real procedural election guidance disclaimer
    

----------

## Final Verification Required

Run:

```powershell
npm install
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

Confirm:

-   app loads
    
-   assistant shell works
    
-   cannot-verify response works
    
-   out-of-scope political refusal works
    
-   source cards are metadata-only
    
-   saved guidance works locally
    
-   Account & Sync is inactive
    
-   Reminder Preferences are inactive/local-only
    
-   Guided Journeys shell works
    
-   Turning 18 soon detail shell works
    
-   Election Basics shell works
    
-   metadata/source registry preview works
    
-   no real election guidance appears
    

----------

## Safety Boundary Checklist

Confirm current build does not include:

-   Gemini model calls
    
-   real source retrieval
    
-   source ingestion/scraping
    
-   verified procedural election guidance
    
-   dates/deadlines
    
-   form instructions
    
-   eligibility rules
    
-   polling instructions
    
-   political recommendations
    
-   Firebase Auth sign-in
    
-   active Firestore sync
    
-   App Check enforcement
    
-   active analytics
    
-   real reminders
    
-   FCM/push/email/SMS/calendar notifications
    

----------

## Out of Scope

Do not implement new features.

Do not activate:

-   Gemini
    
-   Firebase Auth
    
-   Firestore sync
    
-   App Check
    
-   Analytics
    
-   Reminders
    
-   FCM
    
-   Source ingestion
    
-   Real procedural guidance
    

Do not add:

-   new UI flows
    
-   new backend endpoints
    
-   production source content
    
-   election dates/deadlines
    
-   eligibility/form/polling instructions
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of final stabilization/readiness updates
    

### What was intentionally not changed

-   no new features
    
-   no Gemini
    
-   no source retrieval
    
-   no Firebase/Auth activation
    
-   no Firestore sync activation
    
-   no App Check enforcement
    
-   no analytics activation
    
-   no reminders activation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   test counts
    
-   manual smoke checks
    
-   pass/fail result
    

### Final readiness verdict

-   Ready / Not ready
    
-   Any remaining blockers
