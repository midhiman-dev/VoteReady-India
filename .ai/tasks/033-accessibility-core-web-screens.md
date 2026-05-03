# Task 033 — Add Accessibility Pass for Core Web Screens

## Status
Completed

## Branch
fix/accessibility-core-screens-task-033

## Goal

Perform an accessibility pass across the core VoteReady India web screens and components.

This task should improve semantic HTML, labels, focus behavior, button accessibility, status messaging, and keyboard usability without changing product behavior.

This is an accessibility/refinement task only.

---

## In Scope

Review and improve accessibility for:

- AssistantShell
- AssistantResponsePreview
- SavedGuidancePanel
- AuthStatusPanel
- ReminderPreferencesPanel
- GuidedJourneyChooser
- GuidedJourneyDetail
- ElectionBasicsExplainer
- SourceRegistryPreview
- ApiStatusCard

Focus on:

- semantic headings
- accessible form labels
- accessible button names
- keyboard navigation
- aria-live for loading/error/status messages where useful
- non-color-only status labels
- clear section structure
- test coverage for key accessibility expectations

---

## Recommended Files

```text
apps/web/src/components/AssistantShell.tsx
apps/web/src/components/AssistantResponsePreview.tsx
apps/web/src/components/SavedGuidancePanel.tsx
apps/web/src/components/AuthStatusPanel.tsx
apps/web/src/components/ReminderPreferencesPanel.tsx
apps/web/src/components/GuidedJourneyChooser.tsx
apps/web/src/components/GuidedJourneyDetail.tsx
apps/web/src/components/ElectionBasicsExplainer.tsx
apps/web/src/components/SourceRegistryPreview.tsx
apps/web/src/components/*.test.tsx
apps/web/src/App.css

```

Only update files that need accessibility improvements.

----------

## Accessibility Requirements

Ensure:

1.  Every form input has a visible or programmatic label.
    
2.  Buttons have clear accessible names.
    
3.  Loading/error/success messages use appropriate `role` or `aria-live` where useful.
    
4.  Status badges are readable as text, not color-only.
    
5.  Interactive cards are buttons if clickable.
    
6.  Keyboard users can select journeys and topics.
    
7.  Back actions are buttons or links with clear names.
    
8.  Heading order is reasonable.
    
9.  Empty states are announced clearly.
    
10.  No accessibility-only change introduces new product behavior.
    

----------

## Tests Required

Update tests where practical to use accessible queries:

-   `getByRole`
    
-   `getByLabelText`
    
-   `getByText`
    
-   `getByRole('button', { name: ... })`
    

Add or update tests for:

-   assistant input label
    
-   assistant submit button
    
-   save locally button
    
-   saved guidance remove/clear buttons
    
-   reminder preference form labels
    
-   journey cards as accessible buttons
    
-   election basics topic cards as accessible buttons
    
-   back buttons
    
-   status messages
    

Do not add heavy accessibility tooling in this task.

----------

## Out of Scope

Do not implement:

-   visual redesign
    
-   new product features
    
-   API changes
    
-   Gemini
    
-   source retrieval
    
-   Firebase/Auth behavior changes
    
-   App Check enforcement
    
-   analytics activation
    
-   real reminders
    
-   real election guidance
    
-   dates, deadlines, eligibility rules, form instructions, polling instructions, document instructions, or state-specific guidance
    

----------

## Constraints

-   Keep behavior unchanged.
    
-   Do not add dependencies unless absolutely necessary.
    
-   Do not change API behavior.
    
-   Do not remove safety copy.
    
-   Do not weaken local-only/auth-inactive/App-Check-inactive messaging.
    
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

-   app loads
    
-   keyboard navigation works through assistant, saved guidance, auth/sync, reminders, journeys, and election basics
    
-   form labels are clear
    
-   buttons are accessible
    
-   status messages remain readable
    
-   no product behavior changed
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of accessibility improvements
    

### What was intentionally not changed

-   no product behavior changes
    
-   no API changes
    
-   no Gemini
    
-   no Firebase/Auth activation
    
-   no App Check enforcement
    
-   no analytics activation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
