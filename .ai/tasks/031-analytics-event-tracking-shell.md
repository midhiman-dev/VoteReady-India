# Task 031 — Add Analytics Event Tracking Shell for Core Demo Flows

## Status
In Progress

## Branch
feat/analytics-shell-task-031

## Goal

Add a safe analytics event tracking shell for core VoteReady India demo flows.

This task should define event names, event payload shapes, and a disabled-by-default tracking adapter.

It must not activate real analytics, Firebase Analytics, Google Analytics, external telemetry, tracking pixels, or personal data collection.

This is a frontend analytics shell task only.

---

## Why

Tasks 001–030 established:

- web app shell
- Cloud Run API shell
- assistant endpoint
- assistant-first UI shell
- source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser
- Election Basics shell
- local Saved Guidance shell
- local Reminder Preferences shell
- Firebase/Firestore shell
- Firebase Auth shell

The next product-readiness layer is analytics instrumentation.

For the challenge/demo, we should be able to show that core flows are instrumented, while keeping privacy and safety boundaries intact.

This task adds the analytics structure but keeps tracking disabled by default.

---

## In Scope

Add a disabled-by-default analytics shell.

The shell should:

1. Define core analytics event names.
2. Define safe event payload types.
3. Add an analytics config/status helper.
4. Add a no-op analytics adapter.
5. Add optional console-debug behavior only when explicitly enabled.
6. Instrument core demo flows with safe, non-personal events.
7. Add tests for config, no-op behavior, and event calls.
8. Preserve all existing app behavior.

---

## Environment Variables

Add placeholders to `.env.example` and `apps/web/.env.example` if appropriate.

Recommended Vite variables:

```text
VITE_ANALYTICS_ENABLED=false
VITE_ANALYTICS_DEBUG=false
VITE_ANALYTICS_PROVIDER=disabled

```

Important:

-   Analytics must be disabled by default.
    
-   Do not commit real analytics IDs.
    
-   Do not add Google Analytics IDs.
    
-   Do not add Firebase Analytics measurement IDs unless empty placeholder only.
    
-   Do not send events to any external service.
    
-   Do not log event payloads unless debug is explicitly enabled.
    
-   Do not collect personal data.
    

----------

## Recommended Files

Likely files:

```text
.env.example
apps/web/.env.example
apps/web/src/lib/analytics.ts
apps/web/src/lib/analytics.test.ts
apps/web/src/components/AssistantShell.tsx
apps/web/src/components/GuidedJourneyChooser.tsx
apps/web/src/components/ElectionBasicsExplainer.tsx
apps/web/src/components/SavedGuidancePanel.tsx
apps/web/src/components/ReminderPreferencesPanel.tsx

```

Optional only if useful:

```text
packages/shared/src/analyticsEvents.ts
packages/shared/src/index.ts

```

If event names/types are useful across future API/web tasks, add them to `packages/shared`.

----------

## Suggested Event Names

Add safe event names for core demo flows:

```text
assistant_question_submitted
assistant_response_received
assistant_response_saved_locally
saved_guidance_removed
saved_guidance_cleared
guided_journey_selected
guided_journey_back_clicked
election_basics_topic_selected
election_basics_back_clicked
reminder_preferences_saved
reminder_preferences_reset
auth_shell_viewed

```

Do not track raw user question text.

Do not track user identity.

Do not track location.

Do not track device fingerprinting data.

----------

## Suggested Event Payload Rules

Allowed payload fields:

```text
language
explanationMode
responseStatus
sourceCount
journeyId
topicId
storageMode
cloudSyncActive
authMode
remindersEnabled
preferredChannelPlaceholder
timingPreferencePlaceholder

```

Not allowed:

```text
raw question text
full answer text
email
phone number
name
UID
IP address
precise location
auth token
Firebase config values
source content
personal identity data

```

----------

## Suggested Shared Contract

If using shared types, add something like:

```ts
export type AnalyticsEventName =
  | "assistant_question_submitted"
  | "assistant_response_received"
  | "assistant_response_saved_locally"
  | "saved_guidance_removed"
  | "saved_guidance_cleared"
  | "guided_journey_selected"
  | "guided_journey_back_clicked"
  | "election_basics_topic_selected"
  | "election_basics_back_clicked"
  | "reminder_preferences_saved"
  | "reminder_preferences_reset"
  | "auth_shell_viewed";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  timestamp: string;
  payload?: Record<string, string | number | boolean | null>;
}

```

Keep payloads minimal and non-personal.

----------

## Analytics Adapter Requirements

Create a small dependency-free adapter.

Suggested functions:

```ts
export interface AnalyticsStatus {
  enabled: boolean;
  debug: boolean;
  provider: "disabled" | "console_debug";
}

export function getAnalyticsStatus(env?: ImportMetaEnvLike): AnalyticsStatus;

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  payload?: AnalyticsPayload
): void;

```

Expected behavior:

### Default

If env vars are absent:

```text
enabled: false
provider: disabled

```

No event is logged or sent.

### Debug enabled

If:

```text
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_DEBUG=true
VITE_ANALYTICS_PROVIDER=console_debug

```

Then the adapter may log safe event names and sanitized payloads to console.

Do not log raw question text or response text.

### Unsupported provider

If an unknown provider is configured, fall back safely to disabled/no-op.

----------

## UI Instrumentation Requirements

Instrument these events using the no-op adapter:

### AssistantShell

Track:

-   assistant question submitted
    
-   assistant response received
    
-   assistant response saved locally
    

Payload should include:

```text
language
explanationMode
responseStatus
sourceCount

```

Do not include question text.

### SavedGuidancePanel

Track:

-   saved guidance removed
    
-   saved guidance cleared
    

Payload may include:

```text
storageMode: local

```

Do not include saved question text.

### GuidedJourneyChooser

Track:

-   guided journey selected
    
-   guided journey back clicked
    

Payload may include:

```text
journeyId

```

### ElectionBasicsExplainer

Track:

-   election basics topic selected
    
-   election basics back clicked
    

Payload may include:

```text
topicId

```

### ReminderPreferencesPanel

Track:

-   reminder preferences saved
    
-   reminder preferences reset
    

Payload may include:

```text
remindersEnabled
preferredChannelPlaceholder
timingPreferencePlaceholder

```

Do not include identity fields.

### AuthStatusPanel

Optional:

-   track auth shell viewed only if easy and safe
    

Payload may include:

```text
authMode
cloudSyncActive

```

Avoid excessive render-based event spam. If tracking view events is awkward, skip it.

----------

## Tests Required

Add tests for:

### Analytics helper

1.  disabled by default
    
2.  disabled when env says false
    
3.  console debug mode only when explicitly enabled
    
4.  unsupported provider falls back to disabled
    
5.  event tracking is no-op when disabled
    
6.  debug tracking does not include forbidden payload fields
    
7.  raw question text is not tracked by assistant instrumentation
    

### Component behavior

Update tests only as needed to verify calls to the analytics adapter for:

-   assistant submit
    
-   assistant response received
    
-   save locally
    
-   guided journey selection
    
-   election basics topic selection
    
-   reminder preferences save/reset
    

Do not make tests brittle. It is acceptable to mock the analytics adapter.

----------

## Forbidden Content / Data

Do not track or display:

```text
raw question text
full response text
email address
phone number
full name
UID
auth token
IP address
precise location
Firebase API key
Firebase app ID
device fingerprint

```

Do not add procedural election guidance:

```text
Form 6
register by
deadline
eligible if
eligibility criteria
advance registration
voter ID required
polling date
submit this document
carry this document
go to this portal

```

----------

## Out of Scope

Do not implement:

-   Google Analytics
    
-   Firebase Analytics activation
    
-   external telemetry
    
-   tracking pixels
    
-   analytics dashboards
    
-   backend analytics routes
    
-   BigQuery export
    
-   user/session tracking
    
-   device fingerprinting
    
-   cookie banners
    
-   consent management
    
-   Firebase Auth
    
-   real cloud sync
    
-   FCM
    
-   reminders activation
    
-   Gemini
    
-   model calls
    
-   source retrieval
    
-   source grounding generation
    
-   procedural election guidance
    

----------

## Constraints

-   Analytics must be disabled by default.
    
-   No external network calls.
    
-   No new analytics SDKs.
    
-   No personal data collection.
    
-   No raw question or answer tracking.
    
-   Do not change API behavior.
    
-   Do not add backend routes.
    
-   Keep saved guidance local-first.
    
-   Keep Auth shell inactive.
    
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

-   web app loads
    
-   assistant shell still works
    
-   Saved Guidance still works locally
    
-   Account & Sync remains inactive
    
-   Reminder Preferences still works
    
-   Guided Journeys still work
    
-   Election Basics still works
    
-   metadata and source registry preview still work
    
-   analytics is disabled by default
    
-   no external analytics calls happen
    
-   no personal data is collected
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of analytics shell and safe instrumentation
    

### What was intentionally not changed

-   no Google Analytics
    
-   no Firebase Analytics activation
    
-   no external telemetry
    
-   no tracking pixels
    
-   no personal data collection
    
-   no raw question/answer tracking
    
-   no backend analytics routes
    
-   no Firebase Auth changes
    
-   no cloud sync changes
    
-   no Gemini
    
-   no source retrieval
    
-   no source grounding generation
    
-   no procedural election guidance
    

### Verification performed

-   commands run
    
-   tests run
    
-   browser/manual checks
    
-   pass/fail result
    

### Risks / follow-ups

-   only real issues
