import { LanguagePreference, ExplanationMode } from "./common";

/**
 * Canonical list of supported languages for the VoteReady assistant.
 */
export const SUPPORTED_LANGUAGES: LanguagePreference[] = [
  "english",
  "simple_english",
  "hinglish",
  "hindi",
];

/**
 * Canonical list of supported explanation modes for the VoteReady assistant.
 */
export const SUPPORTED_EXPLANATION_MODES: ExplanationMode[] = [
  "quick",
  "simple",
  "detailed",
];

/**
 * Type guard for LanguagePreference.
 */
export function isSupportedLanguage(value: any): value is LanguagePreference {
  return SUPPORTED_LANGUAGES.includes(value);
}

/**
 * Type guard for ExplanationMode.
 */
export function isSupportedExplanationMode(value: any): value is ExplanationMode {
  return SUPPORTED_EXPLANATION_MODES.includes(value);
}
