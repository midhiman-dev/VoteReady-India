# Task 013 — Add Source Registry UI Safety Labels and Review-Due Messaging Polish

## Status
In Progress

## Branch
feat/source-registry-safety-task-013

## Goal

Improve the web source registry preview so it clearly communicates that the displayed sources are metadata records and not verified procedural guidance.

This task should polish the UI safety labels around freshness states such as:

- review_due
- unverified
- stale
- archived
- verified

This is a UI safety and trust-messaging task only.

---

## Why

The web app currently displays backend-owned source registry metadata from the Cloud Run API.

Because the current source records are static seed metadata and mostly marked `review_due`, the UI must avoid implying that the app already provides verified election guidance.

This task improves:

- source transparency
- manual-review safety
- trust messaging
- clarity for future source-card work
- accessibility of freshness labels

It also protects the product guardrail that VoteReady India should not guess or overclaim on procedural or deadline-sensitive election guidance.

---

## In Scope

Update the existing source registry preview in the web app.

The UI should clearly show:

1. The source registry is a metadata preview.
2. `review_due` means the source needs review before being used for current procedural guidance.
3. Source records are not the same as verified answers.
4. The current app is not yet generating source-backed election guidance.
5. Freshness status should be readable and not color-only.
6. Source count and source titles should remain visible.
7. Existing tests should be updated if needed.

---

## Recommended Files

Likely files:

```text
apps/web/src/components/SourceRegistryPreview.tsx
apps/web/src/components/SourceRegistryPreview.test.tsx
apps/web/src/App.css

```

Optional if useful:

```text
apps/web/src/lib/sourceFreshnessDisplay.ts

```

Only update other files if necessary for imports or typecheck.

----------

## Required UI Messaging

Add or preserve a clear note near the source registry preview, such as:

```text
Source Registry Preview
These are approved source surfaces for future source-backed guidance. Most records are marked review due until they are checked by a current verification workflow.

```

Also include a metadata-only warning such as:

```text
This preview does not provide election instructions, deadlines, eligibility rules, or verified procedural guidance.

```

Use wording close to the above, but keep it short and readable.

----------

## Freshness Label Expectations

Render freshness states with human-friendly labels.

Suggested mapping:

```text
verified -> Verified
review_due -> Review due
stale -> Stale
archived -> Archived
unverified -> Unverified

```

Also show short helper text where practical:

```text
review_due -> Needs review before current procedural use.
unverified -> Not verified for user guidance.
stale -> May be outdated.
archived -> Historical or archived source.
verified -> Checked by an approved verification workflow.

```

Important:  
Do not mark existing records as `verified`.  
Do not change source registry data.  
Do not claim a source was checked unless the data says so.

----------

## Source Record Display Expectations

For each visible source, display:

-   title
    
-   source type
    
-   jurisdiction level
    
-   freshness label
    
-   optional helper text
    
-   optional publisher if already available
    

Do not show raw technical status alone without a human-readable label.

Do not rely only on color. Use text labels.

----------

## Test Updates Required

Update or add tests for `SourceRegistryPreview`.

Tests should verify:

-   the metadata-only safety note is shown
    
-   `review_due` renders as `Review due`
    
-   review-due helper text is shown
    
-   source titles still render
    
-   source count still renders
    
-   the UI does not label review-due sources as verified
    
-   no procedural election guidance appears
    

If a helper file is added, add simple unit tests only if it is easy and valuable. Do not overbuild.

----------

## Out of Scope

Do not implement:

-   source ingestion
    
-   source scraping
    
-   source retrieval
    
-   source verification workflow
    
-   Firestore persistence
    
-   Cloud Storage snapshots
    
-   admin/source review screen
    
-   source detail screen
    
-   final source-card UI
    
-   assistant chat UI
    
-   Gemini integration
    
-   prompt construction
    
-   source-grounded answer generation
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   Analytics
    
-   Auth
    
-   App Check
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, or polling instructions
    

----------

## Constraints

-   Keep this task UI-safety focused.
    
-   Do not change API behavior.
    
-   Do not change shared source registry seed data.
    
-   Do not change freshness statuses in the registry.
    
-   Do not add new dependencies.
    
-   Do not redesign the app shell.
    
-   Preserve existing metadata and mock assistant panels.
    
-   Keep copy politically neutral and source-safety aligned.
    
-   Keep build, typecheck, and tests passing.
    

----------

## Accessibility Expectations

The source registry labels should be:

-   text-based, not color-only
    
-   readable
    
-   grouped with the relevant source
    
-   understandable without technical knowledge
    
-   easy to scan
    

Use semantic HTML where practical.

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/web
npm test --workspace=@voteready/api

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
    
-   metadata display still works
    
-   source registry preview still works
    
-   source registry shows clear metadata-only safety note
    
-   review_due is shown as Review due
    
-   review-due helper text is visible
    
-   source titles and count still render
    
-   mock assistant panel still works
    
-   no real election guidance appears
    
-   root build passes
    
-   root typecheck passes
    
-   web tests pass
    
-   API tests pass
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of source registry safety label improvements
    

### What was intentionally not changed

-   no source data changes
    
-   no source ingestion
    
-   no verification workflow
    
-   no API behavior changes
    
-   no Gemini
    
-   no source grounding
    
-   no Firebase/Firestore
    
-   no guided journeys
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues