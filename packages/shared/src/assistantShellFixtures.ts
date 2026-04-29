import { 
  AssistantRequest, 
  AssistantResponse,
  AssistantAnswerBlock
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
  sourceCount?: number;
}): AssistantResponse {
  const { request, generatedAt, sourceCount } = params;
  const timestamp = generatedAt || new Date().toISOString();

  let answerBlocks: AssistantAnswerBlock[] = [];

  if (request.explanationMode === 'quick') {
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: "VoteReady India’s assistant endpoint is connected. Current election guidance is not active yet."
      }
    ];
  } else if (request.explanationMode === 'detailed') {
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: "Current status: This endpoint is ready for future source-grounded orchestration, but it does not yet generate election guidance."
      },
      {
        type: "source_note" as const,
        content: `Source transparency: Safe demo source-transparency context ${sourceCount !== undefined ? `includes ${sourceCount} curated fragments` : 'is available'}. These fragments are not procedural guidance.`
      },
      {
        type: "what_this_means" as const,
        content: "What this means: Real source-backed election guidance is not active yet. All responses are currently limited to safe system confirmations."
      },
      {
        type: "next_steps" as const,
        content: "What comes next: Future updates will integrate Gemini models and real-time source retrieval."
      }
    ];
  } else {
    // Default or 'simple'
    answerBlocks = [
      {
        type: "short_answer" as const,
        content: "VoteReady India’s assistant endpoint is connected, but real source-backed election guidance is not active yet."
      }
    ];
    
    if (sourceCount !== undefined) {
      answerBlocks.push({
        type: "source_note" as const,
        content: `Safe demo source-transparency context includes ${sourceCount} curated fragments. These fragments are not procedural guidance.`
      });
    } else {
      answerBlocks.push({
        type: "source_note" as const,
        content: "Safe demo source-transparency context is available. These fragments are not procedural guidance."
      });
    }
  }

  return {
    id: `shell-${timestamp}`,
    status: "cannot_verify",
    language: request.language,
    explanationMode: request.explanationMode,
    answerBlocks,
    sources: [],
    generatedAt: timestamp,
    freshnessSummary: {
      status: "review_due",
      message: ASSISTANT_SHELL_SOURCE_PENDING_MESSAGE
    },
    disclaimer: ASSISTANT_SHELL_DISCLAIMER
  };
}
