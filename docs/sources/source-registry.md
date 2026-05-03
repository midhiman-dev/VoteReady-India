
# VoteReady India Source Registry

## Document Metadata

| Field | Value |
|---|---|
| Document Title | VoteReady India Source Registry |
| Product | VoteReady India |
| Tagline | Ask. Understand. Be vote-ready. |
| Version | v1.0 |
| Status | Draft |
| Date | 2026-04-25 |
| Owner | Source Operations / Architect / Backend & Google Services Agent |
| Related Documents | `skills.md`, `agents.md`, `docs/architecture/architecture-overview.md`, `docs/testing/demo-checklist.md` |

---

## 1. Purpose

This file defines the approved public-source foundation for VoteReady India.

It exists to make sure the product stays:

- official-source-led
- procedurally grounded
- freshness-aware
- politically neutral
- safe for challenge demo and manual review

This registry is the source-trust backbone for:

- assistant answers
- guided journeys
- source cards
- timelines
- myth-vs-fact clarifiers
- saved guidance
- source refresh jobs

---

## 2. Source Trust Order

VoteReady India must use this trust order:

1. **Election Commission of India (ECI) official sources**
2. **Voters' Services Portal and related official voter-service pages**
3. **Official ECI results and election information pages**
4. **Official public election datasets from trusted government/open-data sources**
5. **Curated derived summaries only when traceable back to official sources**

### Rule

For procedural, eligibility, or deadline-sensitive answers:
- prefer the highest-trust available source
- do not bypass official sources for convenience
- do not present unverified derived text as authoritative

---

## 3. Approved Source Categories

### 3.1 Civic education and election basics
Use for:
- how elections work in India
- election types
- voting concepts
- electoral process basics
- role of the Election Commission

### 3.2 Voter services and procedural guidance
Use for:
- registration
- corrections and updates
- electoral roll search
- e-roll download guidance
- complaint/grievance routing
- polling-day service guidance

### 3.3 Schedules, timelines, and official election updates
Use for:
- election announcements
- phase schedules
- nomination/poll/count dates
- election-event timelines

### 3.4 Results and public election information
Use for:
- official results references
- constituency-level public results pages
- results disclaimers and interpretation notes

### 3.5 Structured public datasets
Use for:
- constituency-level statistical context
- voter statistics
- schedule datasets
- state/UT mappings
- election-reference tables

---

## 4. Approved Initial Source Inventory

### S001 — ECI Main Website

- **Source ID:** `S001`
- **Source Name:** Election Commission of India
- **Source Type:** Official website
- **Primary Use:** Civic education, official election information, announcements, FAQs, public reference material
- **Base URL:** `https://eci.gov.in/`
- **Jurisdiction:** India
- **Trust Level:** Tier 1
- **Access Mode:** Public web
- **Extraction Mode:** Manual reference + controlled extraction if required
- **Use In Product:** Election basics, official information linking, source cards
- **Notes:** Use as the top-level official authority for India-wide election guidance.

### S002 — Voters' Services Portal

- **Source ID:** `S002`
- **Source Name:** Voters' Services Portal
- **Source Type:** Official voter services portal
- **Primary Use:** Registration, voter services, forms, user-facing procedural flows
- **Base URL:** `https://voters.eci.gov.in/`
- **Jurisdiction:** India
- **Trust Level:** Tier 1
- **Access Mode:** Public web
- **Extraction Mode:** Controlled extraction of public informational pages only
- **Use In Product:** Guided journeys, procedural help, source cards, timeline-linked next steps
- **Notes:** Use for public-facing voter-service guidance, not for automating private user actions inside external portals.

### S003 — Electoral Search

- **Source ID:** `S003`
- **Source Name:** Electoral Search
- **Source Type:** Official voter search surface
- **Primary Use:** Search-your-name / electoral-roll lookup guidance
- **Base URL:** `https://electoralsearch.eci.gov.in/`
- **Jurisdiction:** India
- **Trust Level:** Tier 1
- **Access Mode:** Public web
- **Extraction Mode:** Link/reference only unless a tightly scoped public-content use is needed
- **Use In Product:** Explain how users can check voter-list presence and where to go next
- **Notes:** Treat as an official destination for user redirection and explanation, not as an ingestion-heavy content source.

### S004 — Electoral Roll Download

- **Source ID:** `S004`
- **Source Name:** Electoral Roll Download
- **Source Type:** Official voter-service utility
- **Primary Use:** Electoral roll PDF access and public guidance
- **Base URL:** `https://voters.eci.gov.in/download-eroll`
- **Jurisdiction:** India
- **Trust Level:** Tier 1
- **Access Mode:** Public web
- **Extraction Mode:** Link/reference and light metadata capture
- **Use In Product:** “What do I do if my name is missing?” guidance and electoral-roll education
- **Notes:** Use for official routing and explanation, not for bulk PDF ingestion unless explicitly scoped.

### S005 — Official ECI Results Site

- **Source ID:** `S005`
- **Source Name:** ECI Results
- **Source Type:** Official results website
- **Primary Use:** Official results/trends reference and public result explanation
- **Base URL:** `https://results.eci.gov.in/`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public web
- **Extraction Mode:** Controlled extraction for public result pages when needed
- **Use In Product:** Explain what official results pages are, how to interpret them, and where users can verify outcomes
- **Notes:** Not a primary product feature for this challenge, but useful as a trusted official reference surface.

### S006 — NGSP / Voter Mitra Surface

- **Source ID:** `S006`
- **Source Name:** NGSP / Voter Mitra
- **Source Type:** Official grievance/help surface
- **Primary Use:** Complaint and grievance routing awareness
- **Base URL:** `https://voters.eci.gov.in/home/ngsp`
- **Jurisdiction:** India
- **Trust Level:** Tier 1
- **Access Mode:** Public web
- **Extraction Mode:** Link/reference
- **Use In Product:** Explain where users should go for complaint-related issues
- **Notes:** Use for official routing, not as the core product experience.

### S007 — ECI Archive

- **Source ID:** `S007`
- **Source Name:** ECI Archive
- **Source Type:** Official archive
- **Primary Use:** Historical election-reference material and older public announcements
- **Base URL:** `https://eci.gov.in/archive/`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public web
- **Extraction Mode:** On-demand only
- **Use In Product:** Historical context when needed
- **Notes:** Lower priority than current official surfaces for challenge use.

### S008 — data.gov.in Election Catalog / Datasets

- **Source ID:** `S008`
- **Source Name:** Open Government Data Election Resources
- **Source Type:** Official open data platform
- **Primary Use:** Structured election-related datasets and downloadable public data
- **Base URL:** `https://www.data.gov.in/keywords/Election`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public web / download / API where available
- **Extraction Mode:** API-first if available, otherwise official download
- **Use In Product:** Structured reference data, state-wise voter data, constituency mappings, schedule/context datasets
- **Notes:** API availability varies by resource. Prefer documented APIs where available; otherwise use official downloadable files.

### S009 — State-wise Voters Information during 2024

- **Source ID:** `S009`
- **Source Name:** State-wise Voters Information during 2024
- **Source Type:** Official open-data resource
- **Primary Use:** State-level voter statistics
- **Base URL:** `https://www.data.gov.in/resource/state-wise-voters-information-during-2024`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public dataset page / official download
- **Extraction Mode:** Structured dataset ingestion
- **Use In Product:** Context cards, state-level informational summaries, civic education visuals if later added
- **Notes:** Use as supporting reference data, not as the basis for procedural guidance.

### S010 — State/UT-wise Number of Phases Schedule of General Election to Lok Sabha during 2024

- **Source ID:** `S010`
- **Source Name:** State/UT-wise Number of Phases Schedule of GE to Lok Sabha during 2024
- **Source Type:** Official open-data resource
- **Primary Use:** Election schedule reference structure
- **Base URL:** `https://www.data.gov.in/resource/stateuts-wise-number-phases-schedule-general-election-ge-lok-sabha-during-2024`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public dataset page / official download
- **Extraction Mode:** Structured dataset ingestion
- **Use In Product:** Timeline modeling and explanation of how election schedules are structured
- **Notes:** Useful as a reference dataset for timeline-type experiences.

### S011 — State/UT-wise Details of Assembly Segment of PC during 2024

- **Source ID:** `S011`
- **Source Name:** State/UT-wise Details of Assembly Segment of PC during 2024
- **Source Type:** Official open-data resource
- **Primary Use:** Parliamentary constituency to assembly-segment mapping context
- **Base URL:** `https://www.data.gov.in/resource/stateut-wise-details-assembly-segment-pc-parliamentary-constituency-during-2024`
- **Jurisdiction:** India
- **Trust Level:** Tier 2
- **Access Mode:** Public dataset page / official download
- **Extraction Mode:** Structured dataset ingestion
- **Use In Product:** Educational explanation of constituency structure and mappings
- **Notes:** Useful for civic education context, not required for initial MVP assistant answers.

---

## 5. Source Metadata Standard

Every source entry stored in Firestore should support these fields where applicable. 

**Firestore Collection:** `sourceRegistry`

```json
{
  "sourceId": "S001",
  "sourceName": "Election Commission of India",
  "sourceType": "official_website",
  "canonicalUrl": "https://eci.gov.in/",
  "jurisdiction": "India",
  "topicTags": ["election-basics", "official-information"],
  "trustTier": 1,
  "accessMode": "public_web",
  "extractionMode": "manual_or_controlled_extraction",
  "lastVerifiedAt": "",
  "freshnessStatus": "verified",
  "isActive": true,
  "notes": ""
}

```

----------

## 6. Content Fragment Metadata Standard

Every normalized content fragment should support:

**Firestore Collection:** `sourceFragments`

```json
{
  "fragmentId": "",
  "sourceId": "S002",
  "title": "",
  "topic": "",
  "subtopic": "",
  "language": "en",
  "jurisdiction": "India",
  "contentText": "",
  "summaryText": "",
  "proceduralImportance": "high",
  "effectiveDate": "",
  "lastVerifiedAt": "",
  "freshnessStatus": "verified",
  "canonicalUrl": "",
  "notes": ""
}

```

----------

## 7. Freshness Policy

### 7.1 Freshness states

Use one of these values:

-   `verified`
    
-   `review_due`
    
-   `stale`
    
-   `archived`
    
-   `unverified`
    

### 7.2 Rules

-   **verified** — reviewed recently against the official source
    
-   **review_due** — still usable, but should be checked soon
    
-   **stale** — do not present as current procedural truth without warning
    
-   **archived** — historical/reference only
    
-   **unverified** — not safe for authoritative procedural use
    

### 7.3 Product behavior

If content is:

-   `verified` — show normal source card
    
-   `review_due` — show a mild freshness cue
    
-   `stale` — show warning and avoid strong procedural certainty
    
-   `unverified` — do not present as authoritative; redirect to official source
    

----------

## 8. Extraction Rules

### 8.1 Approved extraction modes

-   manual reference entry
    
-   controlled HTML extraction from public official pages
    
-   official downloadable file ingestion
    
-   documented public API ingestion where available
    

### 8.2 Not allowed by default

-   scraping private or undocumented endpoints
    
-   extracting from unofficial mirrors
    
-   using community summaries as primary authority
    
-   generating procedural answers with no official grounding
    
-   bulk harvesting unrelated content just because it is available
    

### 8.3 Extraction preference order

1.  documented official API
    
2.  official structured download
    
3.  official public page extraction
    
4.  manual curation from official source
    

----------

## 9. Source Usage Rules by Product Area

### 9.1 Conversational assistant

Use normalized fragments only.  
Do not let the assistant answer procedural questions from memory alone.

### 9.2 Guided journeys

Use source-backed structured steps and route to official surfaces when user action is required.

### 9.3 Election basics explainer

May use curated explanatory summaries, but only when they are anchored to official source material.

### 9.4 Timelines

Use structured timeline items with source and freshness metadata.

### 9.5 Myth-vs-fact clarifier

Every myth/fact item must have at least one linked approved official source.

----------

## 10. Initial Priority Source Topics

The first source ingestion and normalization priorities should be:

1.  how voting works in India
    
2.  first-time voter basics
    
3.  turning 18 / eligibility basics
    
4.  registration and update journeys
    
5.  moved recently / address-update guidance
    
6.  polling-day basics
    
7.  voter-list / electoral-roll guidance
    
8.  Lok Sabha vs Vidhan Sabha explanation
    
9.  official schedule/timeline reference structure
    
10.  grievance-routing awareness
    

----------

## 11. Challenge and Review Guardrails

This file also supports final challenge scoring and manual review.

### Required guardrails

-   no unsupported claims about official process
    
-   no invented deadlines
    
-   no hidden source substitution
    
-   no hallucinated “official” answers
    
-   no undocumented API claims presented as fact
    
-   no fake source cards
    

### Manual-review readiness

For every important guidance answer, the system should be able to show:

-   which source it came from
    
-   the canonical URL
    
-   the jurisdiction
    
-   the freshness state
    
-   when it was last checked
    

----------

## 12. Recommended First Refresh/Normalization Plan

### Phase 1 — Manual registry setup

-   create Firestore source entries for `S001` to `S011`
    
-   mark trust tier and access mode
    
-   add initial topic tags
    

### Phase 2 — Core fragment creation

Normalize small, high-value content sets for:

-   election basics
    
-   first-time voter guidance
    
-   registration/update guidance
    
-   voter-list guidance
    
-   polling-day basics
    

### Phase 3 — Timeline reference layer

Add structured timeline and schedule reference data from approved sources.

### Phase 4 — Supporting datasets

Add state-level and constituency-structure datasets only where they improve explanation quality.

----------

## 13. Non-Goals

This registry is not meant to become:

-   a giant general-purpose election data warehouse
    
-   a full results data platform
    
-   an unofficial mirror of ECI services
    
-   a replacement for official workflows
    
-   a political content knowledge base
    

----------

## 14. Summary

The VoteReady India source registry exists to keep the product:

-   trusted
    
-   neutral
    
-   official-source-led
    
-   freshness-aware
    
-   challenge-safe
    
-   reviewable by humans after submission
    

If a feature cannot be supported by this trust model, it should be re-scoped before build.
