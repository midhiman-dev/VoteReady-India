# skills.md

## Purpose

This file defines the default engineering behavior, coding rules, architecture guardrails, source-trust rules, and execution discipline for all AI-assisted development in the **VoteReady India** repository.

It should be treated as the **repo-level implementation guide** for:
- Antigravity
- AI coding agents
- implementation prompts
- code review prompts
- test generation prompts
- fix/refactor prompts
- task-brief execution

This file does not replace a task brief.
It exists to make sure all feature work happens consistently, safely, and with strong product alignment.

---


## Organizer Evaluation Alignment

This repository must be built to score strongly against the PromptWars automated assessment and manual review.

### Scored dimensions that must be optimized continuously
- code quality
- security
- efficiency
- testing
- accessibility
- problem statement alignment
- correct mandatory Google tool usage

### Challenge alignment rule
Every meaningful feature must clearly strengthen the current challenge statement:
- trusted election-readiness guidance for India
- Gen-Z and first-time / soon-to-be voters
- official-source-backed guidance
- simple next-step clarity
- Google-native implementation

If a task does not strengthen this challenge alignment, it should be questioned before implementation.

### Mandatory tool usage rule
The build must visibly and correctly use:
- **Antigravity** as the implementation accelerator and build workflow
- **Cloud Run** as a real backend execution layer, not just a placeholder mention

Cloud Run should power at least one meaningful core workflow such as:
- assistant orchestration
- source-backed answer generation
- ingestion or normalization pipeline
- reminder or notification logic
- protected admin/source-health actions

### Google services scoring rule
Google services must be visible in the codebase and in the demo flow.
Do not rely on a static frontend plus a token Gemini call.
At least four meaningful Google services should be used in the primary product path, and Cloud Run must be one of them.

### Submission-attempt strategy rule
PromptWars allows multiple submissions, but only the **final** submission score counts.
Therefore:
- use earlier submissions only as diagnostic passes
- do not use the final attempt until the repo passes the submission checklist
- treat the final attempt as a release candidate, not an experiment

### Manual-review rule
After automated scoring, organizers may manually review the submission and LinkedIn documentation.
Therefore:
- do not make unsupported claims
- do not let the product present hallucinated procedural guidance
- keep source registry, freshness metadata, and demo documentation honest
- ensure LinkedIn/demo notes match the actual implemented features
- maintain a clean evidence trail for Google services usage and problem-statement fit

---
## Project Identity

**Project Name:** VoteReady India

**Tagline:** Ask. Understand. Be vote-ready.

**Project Type:** Interactive civic education assistant for India

**Challenge Context:** PromptWars / challenge build

**Primary Audience:**
- Gen-Z voters
- first-time voters
- soon-to-be voters
- users who feel confused, intimidated, or under-informed about voting and elections

**Core Product Intent:**
VoteReady India helps young Indians understand how elections work, what applies to their situation, and what to do next through simple, conversational, source-backed guidance.

The product should help users answer questions such as:
- How does voting work in India?
- Am I eligible yet?
- What should I do next?
- Which form or step applies to me?
- What dates matter for my situation?
- What happens on polling day?
- Which official source confirms this?

**Core Product Positioning:**
A source-backed, conversational civic education assistant for India’s first-time and soon-to-be voters.

**User-Facing One-Line Description:**
Ask anything about voting in India — get simple, trusted, step-by-step guidance.

**Primary Product Surfaces:**
- conversational assistant web app / PWA
- scenario-based guided journeys
- election basics explainer flows
- source-backed answer cards
- timeline and key-procedure views
- saved guidance and reminders
- admin/source-ops surface if included

---

## Default Working Mode

This repository uses a **skills-led Antigravity build model**.

### Mandatory execution pattern
Always work in this order:

**one task brief -> one implementation task -> one verification -> one review -> one commit**

### Default operating rules
- Read `skills.md` before coding.
- Read `agents.md` before coding when role boundaries matter.
- Read the active task brief before making changes.
- Implement only the requested task.
- If a task is too broad, split it before coding.
- Do not expand scope silently.
- Do not modify unrelated files.
- Keep the app runnable and demoable whenever practical.
- Verify work before handing it off.

### Order of authority
If there is any conflict, follow this order:
1. active task brief
2. `skills.md`
3. `agents.md`
4. approved repo conventions
5. agent judgment

---

## Product Priorities

When making trade-offs, optimize in this order:

1. trust and correctness
2. clear user understanding
3. meaningful Google services usage
4. working demo quality
5. clean modular code
6. accessibility and inclusiveness
7. testing and verification
8. feature depth
9. extensibility

### Practical interpretation
- A smaller trustworthy feature is better than a larger risky feature.
- A grounded answer with source and freshness is better than a clever answer without provenance.
- A working Google-native flow is better than decorative integrations.
- Clear guidance is better than feature overload.
- Protect the demo at all times.

---

## Approved Product Guardrails

### Core positioning rule
VoteReady India is an **interactive civic education assistant** first and a utility layer second.
The assistant is the product.
Timelines, checklists, reminders, and saved progress are supporting features.

VoteReady India is not:
- a political persuasion app
- a candidate recommendation engine
- a party comparison tool
- a social opinion platform
- a clone of ECI services
- a static FAQ portal
- a generic chatbot without grounded guidance

### Challenge-alignment rule
The product must help users:
- understand how elections and voting work in India
- understand what applies to their situation
- understand timelines, key procedures, and next steps
- ask diverse questions conversationally
- learn at different levels of prior knowledge

The assistant should feel like talking to an informed guide, not reading a textbook.

### Core feature set rule
The build should prioritize these product capabilities.

#### P0 — Must-have core features
1. **Conversational Election Guide**
   - handle natural questions about voting, elections, timelines, procedures, and common scenarios
   - answer conversationally, clearly, and with grounded source support

2. **Adaptive Explanation Modes**
   - support quick, simple, and detailed answers
   - adapt to user knowledge level where practical

3. **What Applies to Me? Guided Journeys**
   - support scenarios such as first-time voter, turning 18 soon, moved recently, polling-day help, name missing from voter list, and election basics

4. **Election Basics Explained**
   - explain concepts such as how voting works in India, election types, constituency basics, electoral rolls, and polling-day flow

5. **Official Source Cards**
   - attach source title, source type, jurisdiction, and freshness to important procedural answers

6. **Timeline and Key Procedures Guidance**
   - explain dates, windows, deadlines, and why they matter
   - show next-step clarity, not just raw date lists

7. **Multilingual and Plain-Language Support**
   - support plain English, Hinglish, Hindi, or other scoped languages without losing the official meaning

#### P1 — Strong differentiators
- myth-vs-fact or confusion clarifier
- save my guidance
- reminders and nudges
- shareable summary cards

#### P2 — Nice to have
- listen-to-answer or voice mode
- richer glossary modules
- deeper source-ops tools

### Product behavior rule
The product should focus on:
- civic education
- election process understanding
- eligibility awareness
- registration and update journeys
- document and step guidance
- election timeline awareness
- polling-day preparedness
- source-backed explanations
- multilingual simplification
- reminders and saved progress as supporting layers

### Neutrality rule
The product must remain:
- politically neutral
- informational
- non-persuasive
- official-source-led

### Source transparency rule
For any user-facing procedural or deadline-sensitive guidance, the product should show, where applicable:
- source title
- source type
- jurisdiction
- last verified timestamp
- freshness or stale-state indicator

### Uncertainty rule
If the system cannot verify a jurisdiction-specific answer from approved official sources:
- do not guess
- do not fabricate confidence
- clearly say the answer is not verified
- direct the user to the relevant official source path

---

## Official Source Trust Model

VoteReady India must follow an **official-source-first** model.

### Approved source priority
1. **Election Commission of India official sources**
   - `eci.gov.in`
   - official FAQ/help pages
   - official election notices, schedules, and press releases
2. **Voters’ Services Portal**
   - `voters.eci.gov.in`
   - forms, registration guidance, roll-related flows, status flows
3. **Official ECI utility surfaces**
   - `ecinet.eci.gov.in`
   - `electoralsearch.eci.gov.in`
   - `results.eci.gov.in`
4. **Official Government Open Data resources**
   - `data.gov.in`
   - only datasets/resources clearly attributable to ECI or another official government publisher
5. **Curated derived content created inside VoteReady India**
   - only when derived from approved official sources
   - must retain provenance and freshness metadata

### Source usage rules
- Prefer structured official data over copied prose when both exist.
- Prefer official dataset/API/download surfaces over undocumented endpoints.
- Do not depend on reverse-engineered private APIs.
- Do not treat social media as authoritative guidance.
- Do not use third-party summaries as source-of-truth for procedural guidance.

### Runtime grounding rule
The assistant must answer from curated approved source data or approved retrieval pipelines.
It must not improvise procedural guidance from model memory alone.

### Freshness rule
Time-sensitive content must carry freshness metadata.
Examples:
- election schedule dates
- registration windows
- revision timelines
- polling dates
- counting dates
- roll publication dates

### Source registry rule
Important source surfaces should be documented in `docs/source-registry.md` or an equivalent registry file.

---

## Approved Stack

### Frontend
- web app or PWA
- React
- TypeScript
- responsive mobile-first UI

### Google-native platform stack
- Firebase Hosting
- Firebase Auth
- Cloud Firestore
- Cloud Run
- Cloud Storage
- Firebase Cloud Messaging (if reminders are in scope)
- Firebase Analytics
- Firebase App Check
- Gemini for explanation, simplification, and guided assistance

### Optional only when justified
- BigQuery
- Cloud Scheduler
- Pub/Sub
- Cloud Tasks
- additional observability tools

### Google services rule
The build should visibly use multiple Google services in the core user flow.
Do not add Google services only as decorative checklist items.

### Minimum visible-in-demo expectation
Aim for at least four meaningful Google services to be visible in code and demo behavior.
Examples:
- Auth
- Firestore
- Cloud Run
- Gemini
- Analytics
- FCM
- Storage
- App Check

### Dependency rule
Do not introduce a new dependency unless:
- the current task clearly needs it
- the benefit is meaningful
- it does not create unnecessary demo risk
- it does not duplicate a built-in Google capability already approved for the project

---

## Suggested Solution Architecture

VoteReady India should keep a clean separation between these concerns:
- UI and app shell
- source ingestion and normalization
- persisted structured data
- assistant orchestration
- reminder/event logic
- shared domain types and selectors
- admin/source-management tools if included

### Recommended logical areas
- user onboarding and scenario selection
- jurisdiction and election context
- checklist and timeline engine
- source-backed answer rendering
- source registry and freshness tracking
- reminder preferences and delivery
- assistant orchestration and safe response composition

### Architecture rule
Do not mix source scraping, business logic, prompt construction, and rendering inside one large component or one large server function.

---

## Repo Shape Expectations

Assume a practical structure like this unless the active task says otherwise:

- `.ai/` for task briefs and templates
- `apps/` for the main web app and any admin app if split
- `services/` for Cloud Run services, ingestion, reminders, and assistant orchestration
- `packages/` for shared domain types, utilities, and UI primitives
- `docs/` for source registry, architecture, demo checklist, and runbooks
- `tests/` for unit, integration, and scenario validation
- `scripts/` for setup, import, sync, or seed utilities

### Placement rule
Put code where future contributors would logically expect it.
Do not hide important logic in random folders.

---

## Coding Standards

### General code quality
- Prefer readable, boring, maintainable code.
- Use clear naming.
- Keep files focused.
- Keep functions focused.
- Avoid hidden side effects.
- Avoid speculative abstractions.
- Remove dead code promptly.
- Do not leave placeholder hacks without labeling them clearly.

### TypeScript rules
- Use strict typing.
- Prefer explicit shared domain types.
- Avoid `any` unless unavoidable and justified.
- Type external data boundaries carefully.
- Treat source records and assistant payloads as explicit contracts.

### React rules
- Prefer functional components.
- Keep components small and composable.
- Separate rendering concerns from data and service concerns.
- Avoid monolithic page components.
- Prefer predictable state flow.
- Reuse shared UI primitives where it improves consistency.

### Service rules
- Keep Firebase/API access isolated from UI.
- Keep ingestion and normalization logic isolated from UI.
- Keep Gemini orchestration isolated from route handlers when practical.
- Keep reminder delivery logic isolated from UI behavior.
- Keep source freshness and provenance logic explicit and testable.

### Domain rules
Keep domain concepts explicit, for example:
- user profile
- voter scenario
- jurisdiction
- election event
- deadline
- source record
- source freshness
- checklist item
- reminder preference
- assistant response card
- verification state

Do not collapse unrelated concepts into vague generic blobs.

---

## UI / UX Rules

### Global UX priorities
- fast comprehension
- simple actions
- clear next step
- visible trust signals
- readable source context
- mobile practicality
- low cognitive load

### Accessibility requirements
- high contrast
- readable text
- large tap targets
- non-color-only status indicators
- clear icons with labels when helpful
- clear loading, stale, offline, and error states
- keyboard accessibility where practical

### User-facing experience rules
Assume the user may be:
- new to voting
- confused by official language
- on mobile
- distracted
- low on trust
- switching between English and Hindi

Therefore:
- show the best next action clearly
- reduce jargon
- explain in plain language
- never hide source context for sensitive guidance
- show freshness clearly on time-sensitive content

### Trust UX rule
Every important guidance surface should make it obvious whether content is:
- verified from official sources
- derived from verified source data
- stale and needs re-checking
- generic and not jurisdiction-specific

### Admin/source UX rule
If an admin/source-ops surface exists, it should favor:
- source health visibility
- last sync / last verified timestamps
- clear failure states
- easy re-run or re-validate actions

---

## Multilingual and AI Rules

### AI role rule
Gemini should help with:
- simplification
- summarization
- multilingual explanation
- guided question handling
- step rephrasing
- checklist generation from approved structured content

Gemini must not become the source of truth.

### Grounding rule
Assistant responses must be grounded in approved official-source content and structured records.

### Unsafe behavior to avoid
- invented deadlines
- invented form applicability
- invented legal/process rules
- politically persuasive language
- unsupported claims about voter eligibility
- unsupported claims about polling arrangements

### Multilingual rule
When simplifying content into Hindi or another supported language:
- preserve the official meaning
- avoid over-summarizing critical conditions
- keep source attribution attached
- do not introduce new interpretation beyond approved content

### Response structure rule
Where applicable, assistant responses should include:
- short answer
- what this means for the user
- next steps
- source card(s)
- jurisdiction and freshness

---

## Data and Ingestion Rules

### Ingestion model
Support a practical hierarchy such as:
- official structured datasets/API if available
- official downloads or files
- official HTML/PDF extraction when needed
- normalized source records in storage/database

### Ingestion rules
- never scrape everything by default
- fetch only what the active task needs
- normalize extracted content into explicit schemas
- preserve provenance for every important record
- preserve timestamps for ingestion and verification

### Storage rules
Use Firestore or equivalent structured storage for:
- source registry
- normalized deadlines and steps
- user progress
- reminder preferences
- cached assistant-ready structured data

Use Cloud Storage or equivalent for:
- source snapshots
- downloaded files
- cached PDFs/CSVs when needed

### Data quality rule
If a source record is incomplete, stale, or low-confidence:
- mark it explicitly
- do not silently present it as authoritative

---

## Security Rules

Even in a challenge build, VoteReady India must be credible.

### Always
- keep secrets out of source files
- use environment variables and secret management appropriately
- gate protected actions
- validate important writes server-side
- treat client input as untrusted
- protect admin/source-ops functions
- protect reminder and saved-profile flows
- use Firebase App Check where practical

### Never
- hardcode secrets into repo files
- trust client authority for admin/source status changes
- expose internal ingestion tools to normal users
- make the assistant appear more authoritative than the underlying verified data

### Privacy rule
Collect only what is needed for the user journey.
Avoid unnecessary personal data.

---

## Performance Rules

### Frontend efficiency
- avoid unnecessary rerenders
- keep page state compact
- lazy-load where it meaningfully helps
- keep mobile performance practical

### Backend efficiency
- do not run expensive retrieval or parsing work in the hot path unless required
- cache normalized source data where useful
- keep assistant orchestration payloads focused
- avoid repeated duplicate source fetches

### Demo efficiency
The app must remain responsive during the demo.
Do not introduce complexity that threatens stability.

---

## Testing Rules

Testing is mandatory.

### Every task must include at least one of:
- unit tests
- integration tests
- manual verification checklist
- scenario validation for user journeys

### Must-test areas
Prioritize test coverage for:
- source attribution behavior
- freshness / stale-state logic
- jurisdiction isolation
- checklist generation
- reminder flows
- assistant grounding and response shaping
- multilingual simplification safety
- protected admin/source actions

### Manual verification rule
If automated testing is not practical in the current slice:
- define exact manual steps
- define expected results
- confirm the outcome before marking the task done

### Regression rule
If touching shared domain models, source logic, Firestore schemas, or assistant orchestration, verify existing behavior still works.

---

## Documentation Rules

Documentation is part of delivery.

### Keep these docs aligned when relevant
- `skills.md`
- `agents.md`
- `docs/source-registry.md`
- `docs/architecture-overview.md`
- `docs/demo-checklist.md`
- `.ai/templates/task-brief.md`
- active task briefs under `.ai/tasks/`

### Update docs when:
- source hierarchy changes
- Google stack usage changes materially
- assistant behavior changes materially
- new shared contracts are introduced
- important assumptions change
- demo flow changes materially

---

## Antigravity Execution Rules

### Core execution rule
Antigravity should be guided by:
- `skills.md`
- `agents.md`
- the active task brief

### Mandatory prompt discipline
Prompts should clearly state:
- the task goal
- the files or modules likely involved
- what must be preserved
- what must not be changed
- the verification required
- the reporting format

### Task-sizing rule
A task is too large if it:
- touches many unrelated files
- changes UI, backend, ingestion, and tests at once without a tight boundary
- cannot be verified simply
- risks demo instability

When uncertain, split the task.

### Fresh-session rule
Prefer fresh Antigravity sessions for distinct tasks when practical.

### No-scope-creep rule
Do not do “while I’m here” refactors unless explicitly authorized.

### Reporting rule
After completing a task, report using this structure:

#### Files changed
- file path
- file path

#### What was implemented
- concise summary

#### What was intentionally not changed
- concise summary

#### Verification
- tests run
- manual checks completed

#### Risks / follow-ups
- only if real

---

## What Not to Do

### Never do these by default
- do not redesign the whole app while implementing a small feature
- do not invent election guidance not backed by approved sources
- do not create politically persuasive experiences
- do not introduce undocumented source dependencies casually
- do not add large infra layers without clear need
- do not mix ingestion, assistant prompting, and rendering in one place
- do not implement multiple unrelated tasks in one pass
- do not touch unrelated files “while here”
- do not weaken accessibility to save time
- do not break demo-ready flows for optional improvements

---


## Evaluation and Submission Gates

### Continuous scoring gate
Before marking a task complete, check whether it improves or protects at least one of:
- problem statement alignment
- code quality
- security
- efficiency
- testing
- accessibility
- mandatory Google tool usage

### Final submission gate
Before the final PromptWars submission, confirm all of the following:
- the product clearly matches the challenge problem statement
- Antigravity was the actual build workflow
- Cloud Run is implemented in a meaningful product path
- Google services are visible in code and demo behavior
- README and architecture notes explain the Google stack truthfully
- testing evidence exists for critical flows
- accessibility checks have been performed on core screens
- security basics are in place for protected/admin flows
- source-backed guidance is visible in the UX
- no obvious hallucinated claim remains in product copy, docs, or LinkedIn notes

### Evidence-pack rule
Keep a lightweight evidence pack ready for manual review:
- architecture summary
- source registry
- Google services mapping to real features
- screenshots or short clips of the main flow
- LinkedIn post notes consistent with the actual product
- known limitations stated honestly

---
## Definition of Good Task Output

A good implementation result should be:
- trustworthy
- scoped correctly
- source-aware
- readable
- testable
- reviewable
- runnable
- demoable
- safe for the next task to build upon

---

## Definition of Done

A task is done only if:
- it matches the task brief
- verification was performed
- source and trust rules were respected
- unrelated scope was not introduced
- code remains maintainable
- the repo remains stable
- any necessary docs/tests were updated

If these are not true, the task is not done.

---

## Preferred Agent Response Format

When reporting completed work, use this structure:

### Files changed
- file path
- file path

### What was implemented
- concise summary

### What was intentionally not changed
- concise summary

### Verification
- tests run / manual checks performed

### Risks / follow-ups
- only if real

---

## Working Motto

**Build small. Stay trusted. Show the source. Keep VoteReady India demo-ready.**
