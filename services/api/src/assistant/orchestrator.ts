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

  // 3. Response shaping
  const response = createAssistantShellResponse({
    request,
    generatedAt,
    sourceCount: groundingContext.status === 'demo_safe' ? groundingContext.sourceCount : undefined,
    sources: groundingContext.status === 'demo_safe' ? groundingContext.sources : []
  });

  return response;
}
