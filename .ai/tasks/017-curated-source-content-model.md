# Task 017 — Add Curated Source Content Model and Safe Demo Source Fragments

## Status
In Progress

## Branch
feat/curated-source-fragments-task-017

## Goal

Add a shared curated source content model and a small set of safe demo source fragments.

This task should create the foundation for future source-grounded assistant responses, but it must not connect the fragments to the assistant endpoint yet.

This is a shared model and fixture task only.

---

## Why

Tasks 001–016 established:

- web app shell
- Cloud Run API shell
- shared source and assistant contracts
- source registry metadata
- mock assistant endpoint
- assistant endpoint shell
- assistant orchestration skeleton
- Gemini config guardrails
- API and web tests

The next safe step is to define how curated source-backed content will be represented before using it in assistant responses.

This task prepares for future work:

- source fragment lookup
- source-grounded response shaping
- source cards
- Gemini prompt grounding
- cannot-verify behavior
- freshness-aware assistant answers

---

## In Scope

Add shared contracts and safe demo fixtures for curated source fragments.

The model should support:

1. Source fragment identity.
2. Linkage to a `SourceRecord` via `sourceId`.
3. Fragment title.
4. Fragment text.
5. Language.
6. Tags or topic labels.
7. Freshness/review status.
8. Safety/use-scope metadata.
9. Optional helper lookup functions.
10. Unit tests for fixture integrity if the repo already supports shared package tests, or API tests if easier.

---

## Recommended Files

Likely shared files:

```text
packages/shared/src/sourceFragments.ts
packages/shared/src/sourceFragmentFixtures.ts
packages/shared/src/index.ts

```

Optional if useful:

```text
packages/shared/src/sourceFragments.test.ts

```

If shared package testing is not set up yet, either:

1.  add minimal shared package Vitest setup, or
    
2.  defer shared package tests and add only build/typecheck-safe fixtures.
    

Do not overbuild test infrastructure if it becomes too large for this task.

----------

## Source Fragment Contract

Add a type similar to:

```ts
export type SourceFragmentUseScope =
  | "demo_safe"
  | "assistant_grounding_candidate"
  | "not_for_user_guidance";

export interface SourceFragment {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  language: LanguagePreference;
  tags: readonly string[];
  freshnessStatus: SourceFreshnessStatus;
  useScope: SourceFragmentUseScope;
  lastReviewedAt?: IsoDateTimeString;
  notes?: string;
}

```

You may adjust field names if there is a cleaner existing naming pattern.

----------

## Safe Demo Fragment Rules

Add a small readonly array, for example:

```ts
export const SAFE_DEMO_SOURCE_FRAGMENTS: readonly SourceFragment[] = [
  // fragments here
];

```

The demo fragments must be safe and non-procedural.

They may describe:

-   source transparency principles
    
-   freshness labels
    
-   the need to check official sources
    
-   the fact that current procedural guidance is not active yet
    
-   general civic education categories without giving instructions
    

They must not include:

-   registration steps
    
-   eligibility rules
    
-   form instructions
    
-   deadlines
    
-   exact dates
    
-   polling day instructions
    
-   constituency-specific guidance
    
-   state-specific guidance
    
-   claims that content is verified for current use
    

----------

## Suggested Safe Demo Fragments

Use safe content like these examples, or equivalent wording:

### Fragment 1 — Source transparency

```text
VoteReady India uses approved source surfaces as references for future source-backed guidance. A source record alone is not the same as a verified answer.

```

### Fragment 2 — Freshness caution

```text
Information marked review due should be checked through an approved verification workflow before it is used for current procedural guidance.

```

### Fragment 3 — Assistant readiness

```text
The assistant should only provide procedural election guidance when the relevant source content is available, reviewed, and connected to the answer flow.

```

These are intentionally not election instructions.

----------

## Source Linkage

Each demo fragment should link to an existing `SourceRecord` by `sourceId` where practical.

Examples:

```text
eci-official-website
voters-services-portal

```

If a source id does not exist in `INITIAL_SOURCE_REGISTRY`, do not invent a mismatched id.

----------

## Optional Helper Functions

Add small dependency-free helpers if useful:

```ts
export function getSourceFragmentsBySourceId(
  sourceId: string,
  fragments: readonly SourceFragment[] = SAFE_DEMO_SOURCE_FRAGMENTS
): readonly SourceFragment[];

export function getDemoSourceFragmentById(
  fragmentId: string,
  fragments: readonly SourceFragment[] = SAFE_DEMO_SOURCE_FRAGMENTS
): SourceFragment | undefined;

```

Do not add retrieval, ranking, scoring, embeddings, or search logic.

----------

## Tests Required

If shared package testing is practical, add tests that verify:

-   every fragment has an id
    
-   every fragment has a sourceId
    
-   every fragment has content
    
-   every fragment sourceId exists in `INITIAL_SOURCE_REGISTRY`
    
-   every demo fragment is marked `demo_safe` or `not_for_user_guidance`
    
-   no demo fragment is marked `verified` unless actual review evidence exists
    
-   no demo fragment contains procedural trigger terms such as:
    
    -   deadline
        
    -   Form 6
        
    -   eligible
        
    -   polling date
        
    -   register by
        
    -   voter ID required
        

If shared package testing is not practical in this task, ensure at minimum that build and typecheck pass.

----------

## Out of Scope

Do not implement:

-   connection to `POST /assistant`
    
-   source retrieval
    
-   source search
    
-   source ranking
    
-   source grounding
    
-   Gemini prompt construction
    
-   Gemini calls
    
-   model calls
    
-   source ingestion
    
-   scraping
    
-   Firestore
    
-   Cloud Storage snapshots
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   frontend changes
    
-   assistant UI changes
    
-   source card UI
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   election guidance content
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    

----------

## Constraints

-   This is a model/fixture task only.
    
-   Keep fragments clearly demo-safe.
    
-   Do not claim fragments are current procedural guidance.
    
-   Do not mark fragments as verified.
    
-   Do not change existing API behavior.
    
-   Do not change existing web behavior.
    
-   Do not add runtime dependencies.
    
-   Do not modify unrelated files.
    
-   Keep build, typecheck, and tests passing.
    
-   Keep the content politically neutral and source-safety aligned.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/api
npm test --workspace=@voteready/web

```

If shared package tests are added, also run:

```powershell
npm test --workspace=@voteready/shared

```

Expected:

-   build passes
    
-   typecheck passes
    
-   existing API tests pass
    
-   existing web tests pass
    
-   shared tests pass if added
    
-   no API behavior changes
    
-   no web behavior changes
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of source fragment model and safe demo fixtures
    

### What was intentionally not changed

-   no assistant endpoint connection
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding
    
-   no source ingestion
    
-   no Firebase/Firestore
    
-   no frontend changes
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
