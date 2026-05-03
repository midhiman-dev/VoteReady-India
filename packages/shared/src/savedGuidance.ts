import { LanguagePreference, ExplanationMode, IsoDateTimeString } from "./common.js";
import { AssistantAnswerStatus, AssistantAnswerBlock, AssistantResponse } from "./assistant.js";
import { SourceRecord } from "./source.js";

/**
 * Represents an assistant response saved by the user.
 * For signed-in users, this is persisted to Firestore.
 * For anonymous users, it stays in localStorage.
 */
export interface SavedGuidanceItem {
  id: string;
  userId?: string; // Firestore-only link
  question: string;
  responseStatus: AssistantAnswerStatus;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  savedTimestamp: IsoDateTimeString;
  shortSummary: string;
  sourceCount: number;
  localOnlyMarker: boolean;
  
  // Rich details for full reconstruction
  answerBlocks?: AssistantAnswerBlock[];
  sources?: SourceRecord[];
  freshnessSummary?: AssistantResponse["freshnessSummary"];
}

export const SAVED_GUIDANCE_STORAGE_KEY = "voteready.savedGuidance.v1";
