# VoteReady India — UI Copy Safety Watchlist

## Purpose

This file lists design-copy issues that must be corrected during implementation.

The Stitch screens are visually approved, but some placeholder content must not be copied directly into the production UI.

## Watchlist Items

### 1. Avoid overly definite procedural claims

Do not copy text such as:

> Yes, you can register in advance.

Safer implementation copy:

> You may be able to register in advance depending on the current official rules. Please confirm using the verified source below.

### 2. Avoid unsourced exact date claims

Do not hardcode election or registration dates unless they come from approved source data.

Use:

- TBD
- Example date
- Source-backed date required
- Review due

### 3. Fix stale-but-verified contradictions

Do not show:

> Status: Verified  
> Last verified: Oct 2023

Use:

> Status: Review due  
> Last verified: Oct 2023

### 4. Avoid undocumented API-looking source labels

Do not use labels such as:

> api.ceodelhi.gov.in

Use safer labels such as:

> State CEO official source page  
> Delhi CEO official website  
> Voters’ Services Portal  
> ECI official website

### 5. Rename static-looking form references

Avoid:

> Form 6 PDF Template

Prefer:

> Official voter registration form reference  
> Voter registration form guidance

### 6. Do not imply the app replaces official sources

Always keep source confirmation visible for procedural guidance.

### 7. Do not implement candidate or party recommendation UI

The product is politically neutral and civic-education-focused.

## Implementation Rule

When in doubt, the UI should say:

> This answer needs a fresh source check.

instead of presenting unsupported confidence.