import {
  IsoDateTimeString,
  LanguagePreference,
  ExplanationMode,
} from "./common";
import { SourceRecord, SourceFreshnessStatus } from "./source";

export type AssistantAnswerStatus =
  | "answered"
  | "needs_clarification"
  | "cannot_verify"
  | "out_of_scope"
  | "error";

export type AssistantAnswerBlockType =
  | "short_answer"
  | "what_this_means"
  | "next_steps"
  | "source_note"
  | "neutral_refusal";

export interface AssistantRequest {
  question: string;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  userContext?: {
    state?: string;
    ageBand?: "under_18" | "turning_18" | "adult" | "unknown";
    scenario?: string;
  };
}

export interface AssistantAnswerBlock {
  type: AssistantAnswerBlockType;
  heading?: string;
  content: string;
}

export interface AssistantResponse {
  id: string;
  status: AssistantAnswerStatus;
  language: LanguagePreference;
  explanationMode: ExplanationMode;
  answerBlocks: AssistantAnswerBlock[];
  sources: SourceRecord[];
  generatedAt: IsoDateTimeString;
  freshnessSummary?: {
    status: SourceFreshnessStatus;
    message: string;
  };
  disclaimer?: string;
}
