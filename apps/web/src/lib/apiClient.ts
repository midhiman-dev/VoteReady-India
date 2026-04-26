import { 
  AppMetadataResponse, 
  SourceRegistryResponse 
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
