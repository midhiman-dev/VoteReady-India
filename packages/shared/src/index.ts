export const APP_NAME = "VoteReady India";
export const APP_VERSION = "0.1.0";
export const TAGLINE = "Ask. Understand. Be vote-ready.";

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  timestamp: string;
}

export * from "./common.js";
export * from "./source.js";
export * from "./assistant.js";
export * from "./sourceRegistry.js";
export * from "./api.js";
export * from "./options.js";
export * from "./mockAssistantFixtures.js";
export * from "./assistantShellFixtures.js";
export * from "./assistantLanguageCopy.js";
export * from "./sourceFragments.js";
export * from "./sourceFragmentFixtures.js";
export * from "./guidedJourneys.js";
export * from "./electionBasics.js";
export * from "./savedGuidance.js";
export * from "./reminderPreferences.js";
export * from "./analyticsEvents.js";

