# Known Limitations — VoteReady India

This document lists the intentional limitations and inactive features in the current build. These are not bugs, but architectural decisions made for the current phase of development.

## 1. Assistant Behavior
- **Deterministic Responses**: The assistant uses a safe response factory. It does not currently call the Gemini API.
- **Limited Scope**: The assistant only responds to a set of curated demo questions.
- **Safety Classifier**: A basic keyword-based classifier is used to detect out-of-scope or sensitive questions.

## 2. Source Metadata
- **Metadata Only**: Source cards display descriptive info from the registry but do not link to real-time verified procedural content.
- **Review Due**: All source records are marked as `review-due` to indicate they require manual validation before being considered "Live".

## 3. Data & Sync
- **Local-Only**: `localStorage` is the only active persistence layer.
- **Auth Shell**: The Account & Sync panel is a visual shell. No real sign-in flows are active.
- **Firestore Inactive**: The Firestore repository abstraction is implemented but disabled by default.

## 4. Notifications & Reminders
- **Placeholder UI**: The Reminder Preferences panel allows saving settings locally, but no notifications (Push, Email, SMS) are sent.
- **No Scheduler**: There is no background task running to process reminders.

## 5. Content Shells
- **Guided Journeys**: The detail views for most journeys are generic placeholders.
- **Election Basics**: The content for election topics is minimal placeholder text.

## 6. Platform Services
- **App Check**: The configuration shell is present but not enforced.
- **Analytics**: Event tracking calls are instrumented but lead to no-op handlers.

---

## Next Steps to Remove Limitations
1.  **Activate Gemini**: Enable the Gemini service in the API backend with proper grounding.
2.  **Source Normalization**: Ingest and normalize real ECI data into the source registry.
3.  **Activate Firebase**: Enable Auth and Firestore sync for authenticated users.
4.  **Reminder Delivery**: Implement Cloud Run jobs or Firebase Functions for reminder delivery.
