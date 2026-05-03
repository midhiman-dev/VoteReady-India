import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSourceGroundingContext } from './sourceGrounding.js';
import { sourceRepository } from '../repositories/sourceRepository.js';
import { INITIAL_SOURCE_REGISTRY, SAFE_DEMO_SOURCE_FRAGMENTS } from '@voteready/shared';

vi.mock('../repositories/sourceRepository.js', () => ({
  sourceRepository: {
    getAllFragments: vi.fn(),
    getSourceRegistry: vi.fn()
  }
}));

describe('sourceGrounding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return context from repository data', async () => {
    vi.mocked(sourceRepository.getAllFragments).mockResolvedValue([...SAFE_DEMO_SOURCE_FRAGMENTS] as any);
    vi.mocked(sourceRepository.getSourceRegistry).mockResolvedValue([...INITIAL_SOURCE_REGISTRY] as any);

    const context = await getSourceGroundingContext();

    expect(context.status).toBe('demo_safe');
    expect(context.sourceCount).toBeGreaterThan(0);
    expect(context.fragments).toHaveLength(SAFE_DEMO_SOURCE_FRAGMENTS.length);
    expect(sourceRepository.getAllFragments).toHaveBeenCalled();
    expect(sourceRepository.getSourceRegistry).toHaveBeenCalled();
  });

  it('should return no_sources_available if registry is empty', async () => {
    vi.mocked(sourceRepository.getAllFragments).mockResolvedValue([]);
    vi.mocked(sourceRepository.getSourceRegistry).mockResolvedValue([]);

    const context = await getSourceGroundingContext();

    expect(context.status).toBe('no_sources_available');
    expect(context.sourceCount).toBe(0);
  });
});
