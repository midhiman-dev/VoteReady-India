# Task 003 — Add Static Source Registry Seed Metadata

## Status
In Progress

## Branch
feat/source-registry-task-003

## Goal

Add a small static source registry seed module in the shared package for VoteReady India.

This task must only define safe source metadata records that future frontend, API, source-ingestion, and assistant flows can reuse.

No source ingestion, scraping, assistant response generation, Gemini integration, Firebase integration, Firestore persistence, or UI rendering should be implemented in this task.

---

## Why

VoteReady India depends on official-source-backed and freshness-aware guidance.

Before building assistant orchestration, source retrieval, source cards, admin/source review, or Firestore persistence, the repo needs a small shared registry of approved source surfaces.

This task creates a safe foundation for future work by defining source metadata such as:

- source id
- source title
- source type
- jurisdiction level
- publisher
- freshness status
- optional notes

Important: these are metadata records only. They are not procedural guidance and must not include election rules, deadlines, form instructions, or user-facing answers.

---

## In Scope

Create or update files in:

```text
packages/shared/src/

```

Recommended files:

```text
packages/shared/src/sourceRegistry.ts
packages/shared/src/index.ts

```

You may also make small changes to existing shared source contracts only if needed for clean typing.

----------

## Out of Scope

Do not implement:

-   source fetching
    
-   source scraping
    
-   source ingestion
    
-   PDF/HTML parsing
    
-   Firestore writes
    
-   Cloud Storage snapshots
    
-   API endpoints
    
-   UI source cards
    
-   admin/source review screens
    
-   assistant response generation
    
-   Gemini integration
    
-   prompt construction
    
-   real procedural election guidance
    
-   exact dates, deadlines, or eligibility claims
    
-   translations or language-specific content
    

----------

## Source Registry Rules

The registry must use the shared `SourceRecord` contract from Task 002.

Source metadata should be conservative.

### Freshness status rule

Do not mark sources as `verified` unless there is an actual verification workflow or current verification timestamp in the repo.

For this task, prefer:

-   `review_due`
    
-   `unverified`
    

### URL rule

`url` is optional in the current contract.

Use URLs only if already present in the repo’s existing source registry documentation and clearly intended as official source surfaces.

If unsure, omit URLs for now and leave the records as source metadata labels.

### Content rule

Do not add procedural claims.

Allowed:

```text
ECI official website
Voters’ Services Portal
Electoral Search
Official ECI Results Site
Government open data source

```

Not allowed:

```text
You can register before turning 18.
Form 6 is required for X.
Last date to register is Y.
Polling date is Z.

```

----------

## Suggested Source Metadata Records

Add a static array such as:

```ts
export const INITIAL_SOURCE_REGISTRY: readonly SourceRecord[] = [
  // records here
];

```

Recommended seed records:

1.  ECI official website
    
2.  Voters’ Services Portal
    
3.  Electoral Search
    
4.  Electoral Roll Download
    
5.  Official ECI Results Site
    
6.  ECI Archive
    
7.  Government open data election resources
    

Use safe fields only.

Suggested examples:

```ts
{
  id: "eci-official-website",
  title: "ECI official website",
  sourceType: "eci_official",
  jurisdictionLevel: "national",
  publisher: "Election Commission of India",
  freshnessStatus: "review_due",
  summary: "Official national election information source surface for future source-backed guidance."
}

```

```ts
{
  id: "voters-services-portal",
  title: "Voters’ Services Portal",
  sourceType: "voters_services_portal",
  jurisdictionLevel: "national",
  publisher: "Election Commission of India",
  freshnessStatus: "review_due",
  summary: "Official voter-service source surface for future registration, status, and voter-service guidance."
}

```

Keep summaries generic and metadata-focused.

----------

## Optional Helper

You may add a tiny helper only if useful and dependency-free:

```ts
export function findSourceRecordById(
  sourceId: string,
  registry: readonly SourceRecord[] = INITIAL_SOURCE_REGISTRY
): SourceRecord | undefined {
  return registry.find((source) => source.id === sourceId);
}

```

Do not add broader business logic.

----------

## Export Requirements

Update:

```text
packages/shared/src/index.ts

```

so future app/API code can import:

```ts
INITIAL_SOURCE_REGISTRY
findSourceRecordById

```

Preserve all existing exports from Task 001 and Task 002.

----------

## Constraints

-   Keep this task limited to shared static source metadata.
    
-   Do not add dependencies.
    
-   Do not add runtime validation libraries.
    
-   Do not create backend routes.
    
-   Do not create frontend UI.
    
-   Do not add real election guidance.
    
-   Do not add real dates or procedural rules.
    
-   Do not claim sources are verified unless there is actual verification evidence.
    
-   Prefer `review_due` or `unverified` freshness status.
    
-   Keep the registry small and readable.
    
-   Keep the repo buildable and type-safe.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck

```

Both must pass.

If exports changed, confirm existing web and API builds still work through the root build.

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of static source registry metadata added
    

### What was intentionally not changed

-   no source ingestion
    
-   no scraping
    
-   no Gemini
    
-   no Firebase/Firestore
    
-   no API routes
    
-   no UI
    
-   no procedural election guidance
    
-   no exact dates or deadline claims
    

### Verification performed

-   commands run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
