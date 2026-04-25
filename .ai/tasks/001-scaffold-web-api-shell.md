# Task 001 — Scaffold Web App and Cloud Run API Shell

## Status
In Progress

## Branch
feat/scaffold-web-api-shell

## Goal

Create the initial VoteReady India web app shell and Cloud Run API shell without implementing product logic.

This task must only establish the runnable technical foundation for future implementation.

## Why

VoteReady India needs a clean starter structure before assistant, source, journey, Gemini, Firestore, or UI product logic is added.

This task prepares:
- `apps/web` for the React + TypeScript web/PWA app
- `services/api` for the Cloud Run backend API shell
- `packages/shared` for shared contracts/types
- root scripts for build/typecheck/dev verification

## In Scope

Create or update:


apps/
  web/

services/
  api/

packages/
  shared/

Also add or update:

-   root `package.json`
    
-   root TypeScript/workspace config if needed
    
-   `.gitignore`
    
-   `.env.example`
    
-   basic README note if needed
    
-   API Dockerfile for Cloud Run readiness
    
-   minimal shared package exports
    
-   root scripts for install/build/typecheck/dev
    

## Out of Scope

Do not implement:

-   assistant logic
    
-   Gemini integration
    
-   Firestore integration
    
-   Auth
    
-   App Check
    
-   source registry ingestion
    
-   guided journeys
    
-   election guidance content
    
-   reminder flow
    
-   analytics
    
-   real UI screens from Stitch
    
-   product-specific business logic
    

## Required Web App Shell

Use:

-   React
    
-   TypeScript
    
-   Vite or equivalent lightweight setup
    

The web app should only show a simple neutral shell such as:

-   product name: VoteReady India
    
-   tagline: Ask. Understand. Be vote-ready.
    
-   basic “Web app shell ready” message
    

No real assistant UI, source cards, election guidance, or journey screens yet.

## Required API Shell

Use:

-   Node.js
    
-   TypeScript
    
-   simple HTTP server suitable for Cloud Run
    

The API should expose only minimal non-product endpoints:

-   `GET /health`
    
-   optionally `GET /`
    

The response should confirm the API shell is running.

Example response shape:

```json
{
  "ok": true,
  "service": "voteready-api",
  "version": "0.1.0"
}



Do not add product endpoints yet.

## Shared Package

Create a minimal shared TypeScript package.

It may include:

-   app name constant
    
-   version constant
    
-   health response type
    

Do not add election, assistant, source, journey, or user models yet.

## Suggested Repo Shape

```text
VoteReady-India/
  apps/
    web/
      src/
      package.json
      tsconfig.json
      vite.config.ts

  services/
    api/
      src/
        server.ts
      package.json
      tsconfig.json
      Dockerfile

  packages/
    shared/
      src/
        index.ts
      package.json
      tsconfig.json

  .ai/
    tasks/
      001-scaffold-web-api-shell.md

  package.json
  .env.example
  .gitignore



## Constraints

-   Keep the task narrow.
    
-   Do not add product behavior.
    
-   Do not copy Stitch screen content yet.
    
-   Do not add fake election guidance.
    
-   Do not add Gemini or Firebase integration yet.
    
-   Do not add unnecessary dependencies.
    
-   Keep code readable and boring.
    
-   Keep repo runnable and reviewable.
    

## Verification Required

Run and report results for:

```powershell
npm install
npm run build
npm run typecheck



Also verify:

```powershell
npm run dev:web
npm run dev:api



Manual API check:

```powershell
Invoke-RestMethod http://localhost:8080/health


Expected:

-   web app starts locally
    
-   API starts locally
    
-   `/health` returns JSON
    
-   build passes
    
-   typecheck passes
    
-   no product logic added
    

## Handoff Report Required

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary
    

### What was intentionally not changed

-   product logic not added
    
-   Gemini/Firebase/source registry not added
    
-   Stitch UI not implemented
    

### Verification performed

-   commands run
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
    