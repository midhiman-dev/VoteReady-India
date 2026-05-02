import { 
  AssistantRequest, 
  AssistantResponse,
  AssistantAnswerBlock
} from "./assistant";
import { SourceRecord } from "./source";
import { IsoDateTimeString, LanguagePreference } from "./common";
import { ASSISTANT_LANGUAGE_COPY } from "./assistantLanguageCopy";

/**
 * Shared assistant shell fixtures for the real assistant endpoint.
 * These are used to ensure consistency across the API and Web applications
 * while strictly avoiding any real election guidance.
 */

export const ASSISTANT_SHELL_DISCLAIMER =
  "Real source-backed election guidance is not active yet.";

export const ASSISTANT_SHELL_SOURCE_PENDING_MESSAGE =
  "This endpoint does not yet use Gemini or verified source retrieval.";

/**
 * Factory to create a safe, non-guidance AssistantResponse for the real endpoint shell.
 */
export function createAssistantShellResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
  sourceCount?: number;
  sources?: SourceRecord[];
}): AssistantResponse {
  const { request, generatedAt, sourceCount, sources = [] } = params;
  const timestamp = generatedAt || new Date().toISOString();

  // Fallback to english if the requested language is unsupported for some reason
  const languageCopy = ASSISTANT_LANGUAGE_COPY[request.language as LanguagePreference] || ASSISTANT_LANGUAGE_COPY.english;

  let answerBlocks: AssistantAnswerBlock[] = [];

  if (request.explanationMode === 'quick') {
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: languageCopy.quick_short_answer
      }
    ];
  } else if (request.explanationMode === 'detailed') {
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: languageCopy.detailed_short_answer
      },
      {
        type: "source_note" as const,
        content: sourceCount !== undefined ? languageCopy.detailed_source_note_with_count(sourceCount) : languageCopy.detailed_source_note_no_count
      },
      {
        type: "what_this_means" as const,
        content: languageCopy.detailed_what_this_means
      },
      {
        type: "next_steps" as const,
        content: languageCopy.detailed_next_steps
      }
    ];
  } else {
    // Default or 'simple'
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: languageCopy.simple_short_answer
      }
    ];
    
    if (sourceCount !== undefined) {
      answerBlocks.push({
        type: "source_note" as const,
        content: languageCopy.source_note_with_count(sourceCount)
      });
    } else {
      answerBlocks.push({
        type: "source_note" as const,
        content: languageCopy.source_note_no_count
      });
    }
  }

  return {
    id: `shell-${timestamp}`,
    status: "cannot_verify",
    language: request.language,
    explanationMode: request.explanationMode,
    answerBlocks,
    sources,
    generatedAt: timestamp,
    freshnessSummary: {
      status: "review_due",
      message: languageCopy.source_pending_message
    },
    disclaimer: languageCopy.disclaimer
  };
}
