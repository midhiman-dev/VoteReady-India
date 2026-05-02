# Task 023 — Add Cannot Verify and Neutral Refusal Response States

## Status
In Progress

## Branch
feat/assistant-safety-states-task-023

## Goal

Add deterministic safety-state handling to the `POST /assistant` endpoint.

The assistant should distinguish between:

1. Safe shell/status questions
2. Procedural or current election guidance questions that cannot be verified yet
3. Political/candidate/party recommendation questions that must receive a neutral refusal

This task must not add Gemini, retrieval, source grounding generation, or real election guidance.

---

## Why

Tasks 001–022 established:

- web app shell
- Cloud Run API shell
- shared contracts
- static source registry metadata
- curated demo source fragments
- assistant endpoint shell
- Gemini config guardrails
- explanation mode behavior
- language preference behavior
- assistant-first UI shell
- safe source metadata cards

The assistant now returns safe metadata and source cards, but it still needs clearer safety behavior for questions that ask for actual procedural guidance or political recommendations.

Task 023 introduces deterministic guardrails so the assistant can safely respond to risky inputs before Gemini or real source retrieval are introduced.

---

## In Scope

Add deterministic request classification and response-state handling for `POST /assistant`.

The assistant should return:

### 1. Current safe shell response

For system/status questions such as:

```text
Can VoteReady India answer questions yet?

```

Return the current safe assistant shell response.

### 2. Cannot verify response

For procedural/current election guidance questions such as:

```text
How do I register to vote?
What is the registration deadline?
Which form should I use?
Am I eligible to vote?
Where is my polling booth?

```

Return:

```text
status: "cannot_verify"

```

and a safe answer explaining that current source-backed procedural guidance is not active yet.

Do not provide steps, dates, form rules, eligibility rules, polling details, or instructions.

### 3. Neutral refusal / out-of-scope response

For political persuasion or candidate/party recommendation questions such as:

```text
Who should I vote for?
Which party is better?
Which candidate should I choose?
Tell me who to support.

```

Return:

```text
status: "out_of_scope"

```

or another existing safe refusal status if the current contract requires it.

The response should explain that VoteReady India can help with civic education and official election information, but cannot recommend candidates, parties, or voting choices.

----------

## Recommended Files

Likely files:

```text
services/api/src/assistant/requestSafety.ts
services/api/src/assistant/orchestrator.ts
services/api/src/assistant/orchestrator.test.ts
services/api/src/routes/api.test.ts

```

Optional if useful:

```text
packages/shared/src/assistantSafetyCopy.ts
packages/shared/src/index.ts

```

Keep this small and deterministic.

----------

## Request Classification Requirements

Add a small dependency-free classifier.

Example shape:

```ts
export type AssistantRequestSafetyCategory =
  | "safe_shell"
  | "cannot_verify_procedural"
  | "neutral_refusal_political";

export function classifyAssistantRequest(question: string): AssistantRequestSafetyCategory;

```

This classifier can use simple keyword matching for now.

Do not use external libraries.

Do not use Gemini.

Do not use web search.

Do not overbuild NLP.

----------

## Suggested Classification Signals

### Procedural/current guidance signals

Examples:

```text
register
registration
deadline
Form 6
eligible
eligibility
polling booth
polling station
voter id
voter list
name missing
address change
where do I vote
how do I vote

```

These should produce `cannot_verify`.

### Political/candidate recommendation signals

Examples:

```text
who should I vote for
which party
which candidate
best candidate
best party
recommend candidate
recommend party
support which party
vote for BJP
vote for Congress
vote for AAP

```

These should produce neutral refusal / out of scope.

Important:  
The classifier is only a guardrail for current deterministic behavior. It is not a final safety system.

----------

## Response Requirements

### Cannot verify response

Must:

-   use `status: "cannot_verify"`
    
-   keep `freshnessSummary.status: "review_due"`
    
-   avoid procedural details
    
-   include source metadata cards if current `/assistant` behavior includes them
    
-   clearly explain that current source-backed procedural guidance is not active yet
    
-   suggest checking official sources without giving detailed steps
    

Safe copy example:

```text
I can’t verify current procedural guidance for this question yet. VoteReady India has source metadata connected, but reviewed procedural answer content is not active.

```

### Neutral refusal response

Must:

-   use `status: "out_of_scope"` if supported
    
-   keep sources empty or metadata-only, whichever is safest
    
-   avoid political persuasion
    
-   avoid recommending candidates or parties
    
-   redirect to civic education
    

Safe copy example:

```text
I can explain election processes and official civic information, but I can’t recommend a candidate, party, or voting choice.

```

### Existing shell response

Must remain available for safe shell/status questions.

----------

## Language and Mode Compatibility

Safety responses should respect the existing language and explanation mode structure where practical.

Minimum acceptable behavior:

-   echo selected `language`
    
-   echo selected `explanationMode`
    
-   keep response safe
    

Preferred behavior:

-   use existing language-copy approach for English, Simple English, Hinglish, and Hindi where easy
    
-   keep detailed mode more structured
    
-   keep quick mode compact
    

Do not introduce external translation.

----------

## Source Card Behavior

For cannot-verify procedural responses:

-   source metadata cards may remain visible if they are clearly labeled metadata-only
    
-   do not imply the cards verify the answer
    

For neutral political refusal responses:

-   safest default is `sources: []`
    
-   if source cards are included, the response must still clearly refuse political recommendation
    

Do not mark any source as verified.

----------

## Tests Required

Update or add tests.

### Classifier tests

Test classification for:

-   safe shell/status question
    
-   registration question
    
-   deadline question
    
-   eligibility question
    
-   polling booth question
    
-   candidate recommendation question
    
-   party recommendation question
    

### Orchestrator tests

Verify:

1.  safe shell question still returns current safe shell behavior
    
2.  procedural question returns `cannot_verify`
    
3.  political recommendation question returns `out_of_scope`
    
4.  procedural response does not include procedural guidance
    
5.  political refusal does not recommend a party/candidate
    
6.  language and explanation mode are echoed
    
7.  `review_due` is preserved where applicable
    
8.  unsafe procedural terms are not included as advice text:
    
    -   deadline date
        
    -   Form 6 instruction
        
    -   eligible to vote
        
    -   polling date
        
    -   register by
        
    -   voter ID required
        

### API route tests

Add tests for valid `/assistant` requests covering:

-   procedural cannot-verify question
    
-   political neutral refusal question
    
-   existing safe shell question
    

Existing tests must continue passing.

### Web tests

Update only if response preview assumptions break.

Do not redesign UI.

----------

## Out of Scope

Do not implement:

-   Gemini SDK installation
    
-   Gemini API calls
    
-   model calls
    
-   external translation APIs
    
-   prompt construction
    
-   prompt templates
    
-   real assistant generation
    
-   real source retrieval
    
-   source search
    
-   source ranking
    
-   source ingestion
    
-   scraping
    
-   embeddings
    
-   Firestore
    
-   Cloud Storage snapshots
    
-   Firebase Auth
    
-   App Check
    
-   Analytics
    
-   FCM
    
-   guided journeys
    
-   saved guidance
    
-   reminders
    
-   production safety classifier
    
-   final source-card design
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, or state-specific guidance
    

----------

## Constraints

-   This is deterministic safety-state handling only.
    
-   Do not add runtime dependencies.
    
-   Do not require Gemini configuration.
    
-   Do not use external translation services.
    
-   Do not expose or log secrets.
    
-   Do not modify the web app unless tests require it.
    
-   Keep copy politically neutral and source-safety aligned.
    
-   Keep build, typecheck, and tests passing.
    
-   Do not break `/assistant/mock`.
    

----------

## Verification Required

Run:

```powershell
npm run build
npm run typecheck
npm test
npm test --workspace=@voteready/api
npm test --workspace=@voteready/web
npm test --workspace=@voteready/shared

```

Also run API and web locally:

```powershell
npm run dev:api
npm run dev:web

```

Manual assistant checks:

```powershell
$shellBody = @{
  question = "Can VoteReady India answer questions yet?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $shellBody

```

```powershell
$proceduralBody = @{
  question = "How do I register to vote?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $proceduralBody

```

```powershell
$politicalBody = @{
  question = "Which party should I vote for?"
  language = "simple_english"
  explanationMode = "simple"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/assistant `
  -ContentType "application/json" `
  -Body $politicalBody

```

Expected:

-   shell/status question returns safe shell response
    
-   procedural question returns cannot-verify response
    
-   political/candidate question returns neutral refusal or out-of-scope response
    
-   no response provides real election guidance
    
-   no response recommends a party/candidate
    
-   assistant UI still works
    
-   source cards remain metadata-only where shown
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of cannot-verify and neutral-refusal safety states
    

### What was intentionally not changed

-   no Gemini
    
-   no external translation service
    
-   no prompt construction
    
-   no source retrieval
    
-   no source grounding generation
    
-   no Firebase/Firestore
    
-   no frontend feature changes unless required by tests
    
-   no procedural election guidance
    
-   no political recommendations
    

### Verification performed

-   commands run
    
-   tests run
    
-   manual safety-state checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
