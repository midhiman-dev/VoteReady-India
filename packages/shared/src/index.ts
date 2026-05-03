export const APP_NAME = "VoteReady India";
export const APP_VERSION = "0.1.0";
export const TAGLINE = "Ask. Understand. Be vote-ready.";

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  timestamp: string;
}

export * from "./common";
export * from "./source";
export * from "./assistant";
export * from "./sourceRegistry";
export * from "./api";
export * from "./options";
export * from "./mockAssistantFixtures";
export * from "./assistantShellFixtures";
export * from "./assistantLanguageCopy";
export * from "./sourceFragments";
export * from "./sourceFragmentFixtures";
export * from "./guidedJourneys";
export * from "./electionBasics";
export * from "./savedGuidance";
export * from "./reminderPreferences";
export * from "./analyticsEvents";

