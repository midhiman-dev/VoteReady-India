import {
  AssistantRequest,
  AssistantResponse,
  IsoDateTimeString,
  createAssistantShellResponse
} from '@voteready/shared';
import { getSourceGroundingContext } from './sourceGrounding.js';
import { classifyAssistantRequest } from './requestSafety.js';
import { getGeminiConfig } from '../config/gemini.js';
import { callGemini } from './geminiClient.js';

export async function orchestrateAssistantResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
}): Promise<AssistantResponse> {
  const { request, generatedAt } = params;

  // 1. Classification (Deterministic Safety Layer)
  const safetyCategory = classifyAssistantRequest(request.question);

  // 2. Source context lookup
  const groundingContext = await getSourceGroundingContext();

  // 3. Initial status mapping
  let status: "answered" | "cannot_verify" | "out_of_scope" = "answered";
  
  if (groundingContext.status === 'no_sources_available') {
    status = "cannot_verify";
  } else if (safetyCategory === "cannot_verify_procedural") {
    status = "cannot_verify";
  } else if (safetyCategory === "neutral_refusal_political") {
    status = "out_of_scope";
  }

  // 4. Gemini Activation (Only for "answered" candidates)
  let geminiAnswer: string | undefined;
  const config = getGeminiConfig();

  if (status === "answered" && config.enabled && config.apiKeyPresent) {
    try {
      geminiAnswer = await callGemini({
        question: request.question,
        sources: groundingContext.sources,
        fragments: groundingContext.fragments,
        language: request.language,
        explanationMode: request.explanationMode,
      }, config);

      // Handle Gemini's own safety/grounding signals
      if (geminiAnswer.includes("[CANNOT_VERIFY]")) {
        status = "cannot_verify";
        geminiAnswer = undefined;
      } else if (geminiAnswer.includes("[OUT_OF_SCOPE]")) {
        status = "out_of_scope";
        geminiAnswer = undefined;
      }
    } catch (error) {
      // Log error but fall back to deterministic shell for demo stability
      console.error("Gemini failed, falling back to safe shell:", error);
    }
  }

  // 5. Response shaping
  const response = createAssistantShellResponse({
    request,
    generatedAt,
    sourceCount: groundingContext.status === 'demo_safe' ? groundingContext.sourceCount : undefined,
    sources: status === 'out_of_scope' ? [] : (groundingContext.status === 'demo_safe' ? groundingContext.sources : []),
    status
  });

  // 6. Gemini Overlays
  if (geminiAnswer && status === "answered") {
    // If Gemini provided a valid grounded answer, override the shell blocks
    response.answerBlocks = [
      {
        type: "short_answer",
        content: geminiAnswer.trim()
      }
    ];
  }

  return response;
}
