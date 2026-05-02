import {
  AssistantRequest,
  AssistantResponse,
  IsoDateTimeString,
  createAssistantShellResponse
} from '@voteready/shared';
import { getSourceGroundingContext } from './sourceGrounding.js';
import { classifyAssistantRequest } from './requestSafety.js';

export async function orchestrateAssistantResponse(params: {
  request: AssistantRequest;
  generatedAt?: IsoDateTimeString;
}): Promise<AssistantResponse> {
  const { request, generatedAt } = params;

  // 1. Classification
  const safetyCategory = classifyAssistantRequest(request.question);

  // 2. Source context lookup
  const groundingContext = await getSourceGroundingContext();

  // 3. Status mapping
  let status: "answered" | "cannot_verify" | "out_of_scope" = "answered";
  if (safetyCategory === "cannot_verify_procedural") {
    status = "cannot_verify";
  } else if (safetyCategory === "neutral_refusal_political") {
    status = "out_of_scope";
  }

  // 4. Response shaping
  const response = createAssistantShellResponse({
    request,
    generatedAt,
    sourceCount: groundingContext.status === 'demo_safe' ? groundingContext.sourceCount : undefined,
    sources: status === 'out_of_scope' ? [] : (groundingContext.status === 'demo_safe' ? groundingContext.sources : []),
    status
  });

  return response;
}
