import {
  AssistantRequest,
  AssistantResponse,
  IsoDateTimeString,
  createAssistantShellResponse
} from '@voteready/shared';
import { getSourceGroundingContext } from './sourceGrounding.js';

export async function orchestrateAssistantResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
}): Promise<AssistantResponse> {
  const { request, generatedAt } = params;

  // 1. Source context lookup
  const groundingContext = await getSourceGroundingContext();

  // 2. Gemini readiness/config placeholder
  // const _isGeminiReady = false; 

  // 3. Response shaping placeholder
  const response = createAssistantShellResponse({
    request,
    generatedAt
  });

  // Update response to use the source-grounding context
  if (groundingContext.status === 'demo_safe') {
    response.answerBlocks.push({
      type: 'neutral_refusal',
      content: `Safe demo source-transparency context includes ${groundingContext.sourceCount} curated fragments. These fragments are not procedural guidance. Current election guidance is not active yet.`
    });
  }

  return response;
}
