import { 
  AppMetadataResponse, 
  SourceRegistryResponse,
  AssistantRequest,
  AssistantResponse
} from '@voteready/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getAppMetadata(): Promise<AppMetadataResponse> {
  const response = await fetch(`${API_BASE_URL}/metadata`);
  if (!response.ok) {
    throw new Error('Failed to fetch app metadata');
  }
  return response.json();
}

export async function getSourceRegistry(): Promise<SourceRegistryResponse> {
  const response = await fetch(`${API_BASE_URL}/source-registry`);
  if (!response.ok) {
    throw new Error('Failed to fetch source registry');
  }
  return response.json();
}

export async function postMockAssistantRequest(request: AssistantRequest): Promise<AssistantResponse> {
  const response = await fetch(`${API_BASE_URL}/assistant/mock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch mock assistant response');
  }

  return response.json();
}

export async function postAssistantRequest(request: AssistantRequest): Promise<AssistantResponse> {
  const response = await fetch(`${API_BASE_URL}/assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch assistant response');
  }

  return response.json();
}

