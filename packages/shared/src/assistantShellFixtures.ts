import { 
  AssistantRequest, 
  AssistantResponse 
} from "./assistant";
import { IsoDateTimeString } from "./common";

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
}): AssistantResponse {
  const { request, generatedAt } = params;
  const timestamp = generatedAt || new Date().toISOString();

  return {
    id: `shell-${timestamp}`,
    status: "cannot_verify",
    language: request.language,
    explanationMode: request.explanationMode,
    answerBlocks: [
      {
        type: "short_answer",
        content: "VoteReady India’s assistant endpoint is connected, but source-backed election guidance is not active yet."
      },
      {
        type: "neutral_refusal",
        content: "This endpoint does not yet use Gemini or verified source retrieval. Real guidance will be added in a later task."
      }
    ],
    sources: [],
    generatedAt: timestamp,
    freshnessSummary: {
      status: "review_due",
      message: ASSISTANT_SHELL_SOURCE_PENDING_MESSAGE
    },
    disclaimer: ASSISTANT_SHELL_DISCLAIMER
  };
}
