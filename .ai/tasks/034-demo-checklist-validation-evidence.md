# Task 034 — Add Demo Checklist Validation and Evidence Notes

## Status
Completed

## Branch
docs/demo-checklist-task-034

## Goal

Add demo validation documentation and evidence notes for the current VoteReady India build.

This task should create a clear checklist showing what has been implemented, how it was verified, and what remains intentionally inactive or shell-only.

This is a documentation and validation task only.

---

## In Scope

Create or update documentation for:

- demo flow checklist
- implemented feature summary
- safety boundary checklist
- verification commands
- evidence notes
- known inactive shell features
- local run instructions
- submission-readiness notes

---

## Recommended Files

```text
docs/testing/demo-checklist.md
docs/release-notes/mvp-demo-validation.md
docs/handover/known-limitations.md
```

Optional if useful:

```text
README.md
```

Only update README if it already has a suitable demo/testing section.

----------

## Demo Checklist Should Cover

Include checklist sections for:

1.  Web app shell
    
2.  API health/metadata/source registry
    
3.  Assistant shell
    
4.  Safe source metadata cards
    
5.  Cannot-verify and out-of-scope safety states
    
6.  Language and explanation mode behavior
    
7.  Saved Guidance local-only behavior
    
8.  Account & Sync inactive shell
    
9.  Reminder Preferences inactive shell
    
10.  Guided Journeys shell
    
11.  Turning 18 soon journey detail shell
    
12.  Election Basics shell
    
13.  Accessibility pass
    
14.  App Check shell
    
15.  Analytics shell
    
16.  Firebase/Firestore disabled-by-default shell
    

----------

## Verification Commands

Include:

```powershell
npm install
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web
npm test --workspace=@voteready/api
npm test --workspace=@voteready/shared
npm run dev:api
npm run dev:web
```

Include local URLs:

```text
API: http://localhost:8080
Web: http://localhost:3000
```

Mention Vite may move to another port if 3000 is busy.

----------

## Manual Demo Flow

Document manual demo steps:

1.  Open web app.
    
2.  Submit safe assistant meta question.
    
3.  Try procedural question such as “How do I register to vote?” and confirm cannot-verify response.
    
4.  Try political recommendation question such as “Which party should I vote for?” and confirm neutral refusal/out-of-scope.
    
5.  Save assistant response locally.
    
6.  Reload page and confirm saved item remains.
    
7.  Remove saved item and clear all.
    
8.  View Account & Sync shell.
    
9.  View Reminder Preferences shell and save/reset placeholder preferences.
    
10.  Open Guided Journeys.
    
11.  Select Turning 18 soon and return.
    
12.  Open Election Basics topic and return.
    
13.  Confirm Source Registry Preview shows metadata-only/review-due messaging.
    

----------

## Safety Boundary Checklist

Explicitly state that the current build does **not** include:

-   Gemini model calls
    
-   real source retrieval
    
-   source ingestion
    
-   scraping
    
-   real procedural election guidance
    
-   dates or deadlines
    
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

## Evidence Notes

Include evidence placeholders like:

```text
Evidence status: command output to be pasted after local verification.
```

or a table:

```text
Area | Verification method | Expected result | Evidence note
```

Do not fabricate evidence.

Do not claim screenshots exist unless they are actually added to the repo.

----------

## Known Limitations

Document:

-   Assistant is deterministic and safe-shell only.
    
-   Source cards are metadata-only.
    
-   Source registry records are review-due.
    
-   Saved Guidance is local-only.
    
-   Auth and cloud sync are inactive.
    
-   Reminder Preferences are inactive placeholders.
    
-   Guided Journeys and Election Basics are shells only.
    
-   App Check and analytics are shell-only.
    
-   No verified procedural guidance is active yet.
    

----------

## Out of Scope

Do not modify app behavior.  
Do not add code features.  
Do not add real election guidance.  
Do not add screenshots unless explicitly requested.  
Do not add generated claims about production readiness beyond current evidence.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
```

If docs-only changes do not require full app runtime verification, still include the latest verification commands in the documentation.

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of demo checklist and evidence docs
    

### What was intentionally not changed

-   no code behavior changes
    
-   no Gemini
    
-   no source retrieval
    
-   no Firebase/Auth activation
    
-   no reminders activation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
