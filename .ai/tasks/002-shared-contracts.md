# Task 002 — Add Shared Source and Assistant Response Contracts

## Status
In Progress

## Branch
feat/shared-contracts-task-002

## Goal

Add shared TypeScript contracts for VoteReady India’s future source-backed assistant flow.

This task must define only reusable types, enums/constants, and lightweight contract exports in `packages/shared`.

No product logic, API behavior, UI behavior, Gemini integration, Firebase integration, or real election content should be implemented in this task.

---

## Why

VoteReady India depends on trusted, source-backed, freshness-aware answers.

Before building assistant orchestration, source registry, guided journeys, or UI source cards, the repo needs clear shared contracts for:

- source records
- source trust/freshness states
- assistant request shape
- assistant response shape
- explanation modes
- language preferences
- source-backed answer cards
- neutral refusal / cannot-verify states

This keeps future frontend and Cloud Run work aligned around explicit contracts instead of ad hoc payloads.

---

## In Scope

Create or update files inside:

```text
packages/shared/src/

```

Recommended files:

```text
packages/shared/src/common.ts
packages/shared/src/source.ts
packages/shared/src/assistant.ts
packages/shared/src/index.ts

```

You may keep this structure slightly different if the existing package pattern suggests a better minimal layout.

----------

## Out of Scope

Do not implement:

-   Gemini calls
    
-   prompt construction
    
-   assistant answer generation
    
-   retrieval logic
    
-   source ingestion
    
-   source registry data
    
-   Firestore schemas
    
-   API endpoints
    
-   UI components
    
-   guided journeys
    
-   election guidance content
    
-   Hindi/Hinglish translation logic
    
-   validation libraries
    
-   runtime business rules
    

----------

## Required Contract Areas

### 1. Common Contracts

Add common primitives such as:

-   `AppEnvironment`
    
-   `IsoDateTimeString`
    
-   `LanguagePreference`
    
-   `ExplanationMode`
    

Suggested values:

```ts
export type AppEnvironment = "local" | "development" | "staging" | "production";

export type IsoDateTimeString = string;

export type LanguagePreference =
  | "english"
  | "simple_english"
  | "hinglish"
  | "hindi";

export type ExplanationMode = "quick" | "simple" | "detailed";

```

----------

### 2. Source Contracts

Add source-related contracts for official-source-backed guidance.

Suggested types:

```ts
export type SourceType =
  | "eci_official"
  | "voters_services_portal"
  | "eci_utility"
  | "government_open_data"
  | "curated_derived";

export type SourceFreshnessStatus =
  | "verified"
  | "review_due"
  | "stale"
  | "archived"
  | "unverified";

export type JurisdictionLevel =
  | "national"
  | "state"
  | "constituency"
  | "local"
  | "unknown";

```

Suggested interface:

```ts
export interface SourceRecord {
  id: string;
  title: string;
  sourceType: SourceType;
  jurisdictionLevel: JurisdictionLevel;
  jurisdictionName?: string;
  publisher?: string;
  url?: string;
  freshnessStatus: SourceFreshnessStatus;
  lastVerifiedAt?: IsoDateTimeString;
  lastCheckedAt?: IsoDateTimeString;
  summary?: string;
}

```

Important:

-   Keep `url` optional so local/demo source records can exist without hardcoded live links.
    
-   Do not add real official source records in this task.
    
-   Do not hardcode procedural content.
    

----------

### 3. Assistant Contracts

Add assistant request/response contracts.

Suggested types:

```ts
export type AssistantAnswerStatus =
  | "answered"
  | "needs_clarification"
  | "cannot_verify"
  | "out_of_scope"
  | "error";

export type AssistantAnswerBlockType =
  | "short_answer"
  | "what_this_means"
  | "next_steps"
  | "source_note"
  | "neutral_refusal";

```

Suggested interfaces:

```ts
export interface AssistantRequest {
  question: string;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  userContext?: {
    state?: string;
    ageBand?: "under_18" | "turning_18" | "adult" | "unknown";
    scenario?: string;
  };
}

export interface AssistantAnswerBlock {
  type: AssistantAnswerBlockType;
  heading?: string;
  content: string;
}

export interface AssistantResponse {
  id: string;
  status: AssistantAnswerStatus;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  answerBlocks: AssistantAnswerBlock[];
  sources: SourceRecord[];
  generatedAt: IsoDateTimeString;
  freshnessSummary?: {
    status: SourceFreshnessStatus;
    message: string;
  };
  disclaimer?: string;
}

```

Important:

-   These are contracts only.
    
-   Do not implement real response generation.
    
-   Do not add sample election answers.
    
-   Do not imply the app can already answer questions.
    

----------

## Export Requirements

Update `packages/shared/src/index.ts` so future app/API code can import these contracts from the shared package.

Example:

```ts
export * from "./common";
export * from "./source";
export * from "./assistant";

```

Preserve existing exports such as app name, tagline, and health response if already present.

----------

## Constraints

-   Keep this task limited to shared TypeScript contracts.
    
-   Do not add dependencies unless absolutely necessary.
    
-   Do not introduce runtime validation libraries yet.
    
-   Do not create backend routes.
    
-   Do not create frontend UI.
    
-   Do not add real election guidance.
    
-   Do not add real source registry records.
    
-   Keep names readable and product-aligned.
    
-   Prefer explicit contracts over generic blobs.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck

```

Both must pass.

If package exports change, confirm existing web and API builds still work.

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list changed files
    

### What was implemented

-   concise summary of shared contracts added
    

### What was intentionally not changed

-   no assistant logic
    
-   no Gemini
    
-   no Firebase
    
-   no source registry data
    
-   no UI
    
-   no API endpoints beyond existing shell
    

### Verification performed

-   commands run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
    

---
