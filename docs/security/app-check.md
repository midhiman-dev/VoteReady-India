# Firebase App Check Configuration

This document describes the current status and future roadmap for Firebase App Check in VoteReady India.

## Current Status: Shell Only

As of Task 032, VoteReady India contains an **App Check configuration shell**. 

- **Disabled by default**: No App Check SDK is initialized at runtime.
- **No enforcement**: The application does not block any requests based on App Check tokens yet.
- **Metadata only**: The `Account & Sync` panel displays the current configuration status for transparency.

## Purpose of App Check

App Check helps protect our backend services (Cloud Run, Firestore, etc.) from unauthorized clients by verifying that requests originate from our authentic web application.

## Future Roadmap

### 1. Firebase Console Setup
Before activating enforcement, the following steps must be completed in the Firebase Console:
- Enable App Check in the Project Settings.
- Register the web app for reCAPTCHA Enterprise or reCAPTCHA v3.
- Obtain the site key.

### 2. Environment Variables
Once the Firebase setup is complete, update the following variables in your production environment:
- `VITE_APP_CHECK_ENABLED=true`
- `VITE_APP_CHECK_PROVIDER=recaptcha_enterprise_shell` (or `debug_shell` for local testing)
- `VITE_APP_CHECK_RECAPTCHA_SITE_KEY=your-site-key`

### 3. Implementation Steps
- **SDK Initialization**: Initialize `initializeAppCheck` in the web client.
- **Token Injection**: Ensure the SDK automatically attaches App Check tokens to Firebase service calls.
- **Backend Verification**: Update Cloud Run services to verify `X-Firebase-AppCheck` headers.

## Safety Guidelines

> [!IMPORTANT]
> **Never commit real reCAPTCHA site keys or Firebase secrets to the repository.** 
> Use environment variables and secret management for all sensitive configuration.

## Current Non-Goals
- We are **not** enforcing App Check in this phase.
- We are **not** blocking any users or automated tests.
- We are **not** requiring valid site keys for development or build processes.
