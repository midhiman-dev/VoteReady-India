import { LanguagePreference, ExplanationMode, IsoDateTimeString } from "./common";
import { AssistantAnswerStatus } from "./assistant";

/**
 * Represents an assistant response saved locally by the user.
 * We store minimal metadata to avoid stale data or security risks.
 */
export interface SavedGuidanceItem {
  id: string;
  question: string;
  responseStatus: AssistantAnswerStatus;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  savedTimestamp: IsoDateTimeString;
  shortSummary: string;
  sourceCount: number;
  localOnlyMarker: boolean;
}

export const SAVED_GUIDANCE_STORAGE_KEY = "voteready.savedGuidance.v1";
