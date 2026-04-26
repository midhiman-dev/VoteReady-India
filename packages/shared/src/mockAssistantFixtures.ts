import { 
  AssistantRequest, 
  AssistantResponse 
} from "./assistant";
import { IsoDateTimeString } from "./common";

/**
 * Shared mock assistant fixtures for development and testing.
 * These are used to ensure consistency across the API and Web applications
 * while strictly avoiding any real election guidance.
 */

export const DEFAULT_MOCK_ASSISTANT_QUESTION =
  "Can you confirm the assistant contract is connected?";

export const MOCK_ASSISTANT_DEVELOPMENT_DISCLAIMER =
  "This is a mock response for development only.";

export const MOCK_ASSISTANT_SOURCE_PENDING_MESSAGE =
  "Source-backed guidance is not active in this mock endpoint.";

/**
 * Factory to create a safe, non-guidance AssistantResponse for development use.
 */
export function createMockAssistantResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
}): AssistantResponse {
  const { request, generatedAt } = params;
  const timestamp = generatedAt || new Date().toISOString();

  return {
    id: `mock-${timestamp}`,
    status: "cannot_verify",
    language: request.language,
    explanationMode: request.explanationMode,
    answerBlocks: [
      {
        type: "short_answer",
        heading: "Mock assistant endpoint",
        content: "The assistant API contract is connected. Real source-backed election guidance will be added in a later task."
      },
      {
        type: "source_note",
        heading: "Source status",
        content: "No procedural answer has been generated. This response is only a safe contract test."
      }
    ],
    sources: [],
    generatedAt: timestamp,
    freshnessSummary: {
      status: "review_due",
      message: MOCK_ASSISTANT_SOURCE_PENDING_MESSAGE
    },
    disclaimer: MOCK_ASSISTANT_DEVELOPMENT_DISCLAIMER
  };
}
