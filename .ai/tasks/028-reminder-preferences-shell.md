# Task 028 — Add Reminder Preferences Shell

## Status
In Progress

## Branch
feat/reminder-preferences-shell-task-028

## Goal

Add a local-only Reminder Preferences shell to the VoteReady India web app.

Users should be able to view and update reminder preference placeholders locally in the browser, but no actual reminders, notifications, backend jobs, Firebase, FCM, emails, calendar events, or scheduled tasks should be implemented.

This is a frontend local-only shell task.

---

## Why

Tasks 001–027 established:

- web app shell
- Cloud Run API shell
- shared contracts
- assistant endpoint
- assistant-first UI shell
- safe source metadata cards
- cannot-verify and neutral-refusal states
- guided journey chooser shell
- Turning 18 soon journey detail shell
- Election Basics explainer shell
- local Saved Guidance shell

The next product-support shell is reminder preferences.

In the future, users may want reminders for election-related milestones or saved guidance follow-ups. But until verified source-backed dates, Auth, Firebase, FCM, and notification workflows are implemented, the reminder experience must remain local-only and inactive.

---

## In Scope

Add a Reminder Preferences shell to the web app.

The shell should allow users to locally configure placeholder preferences such as:

- reminders enabled / disabled
- preferred reminder channel placeholder
- reminder timing preference placeholder
- language preference display if useful
- local-only inactive status

The shell should clearly explain:

```text
Reminder preferences are stored only in this browser for now. No notifications are scheduled yet.

```

and:

```text
Real reminders require verified source-backed dates and future notification setup.

```

----------

## Recommended Files

Likely files:

```text
apps/web/src/components/ReminderPreferencesPanel.tsx
apps/web/src/components/ReminderPreferencesPanel.test.tsx
apps/web/src/lib/reminderPreferencesStorage.ts
apps/web/src/lib/reminderPreferencesStorage.test.ts
apps/web/src/App.tsx
apps/web/src/App.css

```

Optional if useful:

```text
packages/shared/src/reminderPreferences.ts
packages/shared/src/index.ts

```

Keep the implementation small.

----------

## Suggested Shared Contract

If adding a shared type, use something like:

```ts
export type ReminderPreferenceChannel =
  | "in_app_placeholder"
  | "email_placeholder"
  | "sms_placeholder";

export type ReminderTimingPreference =
  | "one_day_before_placeholder"
  | "three_days_before_placeholder"
  | "one_week_before_placeholder";

export interface ReminderPreferences {
  remindersEnabled: boolean;
  preferredChannel: ReminderPreferenceChannel;
  timingPreference: ReminderTimingPreference;
  updatedAt: IsoDateTimeString;
  localOnly: true;
}

```

Important:

-   These are placeholders only.
    
-   Do not add real email/SMS/FCM behavior.
    
-   Do not collect phone numbers or email addresses.
    
-   Do not store personal identity data.
    

----------

## Local Storage Behavior

Use browser `localStorage`.

Suggested key:

```text
voteready.reminderPreferences.v1

```

Requirements:

-   Store only local placeholder preferences.
    
-   Do not store secrets.
    
-   Do not store auth tokens.
    
-   Do not store email addresses.
    
-   Do not store phone numbers.
    
-   Do not store precise location.
    
-   Do not require login.
    
-   Handle invalid/corrupt localStorage data gracefully.
    
-   If localStorage is unavailable, show a safe error or fallback state.
    

----------

## Reminder Preferences Panel Behavior

Add a section titled:

```text
Reminder Preferences

```

It should show:

-   local-only safety note
    
-   inactive reminder status
    
-   reminders enabled toggle/checkbox
    
-   preferred channel selector with placeholder options
    
-   timing preference selector with placeholder options
    
-   save/update local preferences action
    
-   reset preferences action
    

Example safety note:

```text
Reminder preferences are stored only in this browser. No reminders, emails, SMS, push notifications, or calendar alerts are scheduled yet.

```

Also include:

```text
Reminder timing cannot be activated until verified source-backed dates are connected.

```

----------

## Placement in App

Recommended page order:

1.  Product heading / tagline
    
2.  Assistant shell
    
3.  Saved Guidance panel
    
4.  Reminder Preferences panel
    
5.  Guided Journey chooser
    
6.  Election Basics explainer shell
    
7.  API metadata
    
8.  Source registry preview
    

Do not remove or weaken the assistant shell.

----------

## Forbidden Content

Do not include:

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

Also do not include:

-   actual election dates
    
-   actual reminder dates
    
-   notification scheduling language that implies reminders are active
    
-   email/SMS collection fields
    
-   phone number fields
    
-   calendar integration fields
    

----------

## Tests Required

Add tests for reminder preferences behavior.

Test at minimum:

1.  Reminder Preferences heading renders.
    
2.  Local-only/inactive safety note renders.
    
3.  Default preferences render.
    
4.  User can toggle reminders enabled locally.
    
5.  User can select a placeholder channel.
    
6.  User can select a placeholder timing preference.
    
7.  Save/update action stores preferences locally.
    
8.  Reset action clears preferences or restores defaults.
    
9.  Corrupt localStorage data does not crash the app.
    
10.  UI clearly says no notifications are scheduled yet.
    
11.  No forbidden procedural terms appear.
    

----------

## Out of Scope

Do not implement:

-   real reminders
    
-   scheduled notifications
    
-   browser push notifications
    
-   FCM
    
-   Firebase
    
-   Firestore
    
-   Auth
    
-   user accounts
    
-   email reminders
    
-   SMS reminders
    
-   calendar integration
    
-   backend reminder APIs
    
-   background jobs
    
-   saved journey progress
    
-   verified election date logic
    
-   Gemini
    
-   model calls
    
-   source retrieval
    
-   source grounding generation
    
-   procedural election guidance
    
-   dates, deadlines, form rules, eligibility rules, polling instructions, document instructions, or state-specific guidance
    

----------

## Constraints

-   This is a frontend local-only shell task.
    
-   Do not change API behavior.
    
-   Do not add backend routes.
    
-   Do not add Firebase/Auth/Firestore/FCM.
    
-   Do not add notification scheduling.
    
-   Do not add dependencies unless absolutely necessary.
    
-   Keep stored data minimal and non-sensitive.
    
-   Keep copy neutral, safe, and local-only.
    
-   Keep build, typecheck, and tests passing.
    
-   Preserve existing assistant, saved guidance, journeys, election basics, metadata, and source registry behavior.
    

----------

## Accessibility Expectations

Use:

-   visible labels
    
-   accessible form controls
    
-   accessible buttons
    
-   clear local-only notice
    
-   clear inactive reminder status
    
-   non-color-only status labels
    

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
    
-   saved guidance still works
    
-   Reminder Preferences panel appears
    
-   local-only/inactive safety note appears
    
-   preferences can be changed and saved locally
    
-   preferences persist across reload
    
-   reset works
    
-   guided journeys still work
    
-   Election Basics still works
    
-   metadata and source registry preview still work
    
-   no actual reminders are scheduled
    
-   no real election guidance appears
    

----------

## Expected Antigravity Handoff

After implementation, report:

### Files changed

-   list files
    

### What was implemented

-   concise summary of Reminder Preferences local-only shell
    

### What was intentionally not changed

-   no real reminders
    
-   no notifications
    
-   no FCM
    
-   no Firebase
    
-   no Auth
    
-   no Firestore
    
-   no backend persistence
    
-   no backend reminder API
    
-   no email/SMS/calendar integration
    
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
