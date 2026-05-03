import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SourceCache } from './sourceCache.js';
import { INITIAL_SOURCE_REGISTRY, SAFE_DEMO_SOURCE_FRAGMENTS } from '@voteready/shared';

describe('SourceCache', () => {
  let cache: SourceCache;

  beforeEach(() => {
    cache = new SourceCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Restore env
    delete process.env.SOURCE_CACHE_TTL_MS;
  });

  // ─── Registry ─────────────────────────────────────────────────────────────

  it('returns null when registry cache is empty', () => {
    expect(cache.getRegistry()).toBeNull();
  });

  it('returns cached registry before TTL expires', () => {
    cache.setRegistry([...INITIAL_SOURCE_REGISTRY]);
    vi.advanceTimersByTime(4 * 60 * 1000); // 4 minutes
    expect(cache.getRegistry()).not.toBeNull();
    expect(cache.getRegistry()).toHaveLength(INITIAL_SOURCE_REGISTRY.length);
  });

  it('expires registry cache after default TTL (5 minutes)', () => {
    cache.setRegistry([...INITIAL_SOURCE_REGISTRY]);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1); // just over 5 minutes
    expect(cache.getRegistry()).toBeNull();
  });

  it('respects SOURCE_CACHE_TTL_MS env var', () => {
    process.env.SOURCE_CACHE_TTL_MS = '1000'; // 1 second TTL
    cache.setRegistry([...INITIAL_SOURCE_REGISTRY]);
    vi.advanceTimersByTime(999);
    expect(cache.getRegistry()).not.toBeNull();
    vi.advanceTimersByTime(2); // crosses 1000ms
    expect(cache.getRegistry()).toBeNull();
  });

  // ─── Fragments ────────────────────────────────────────────────────────────

  it('returns null when fragments cache is empty', () => {
    expect(cache.getFragments()).toBeNull();
  });

  it('returns cached fragments before TTL expires', () => {
    cache.setFragments([...SAFE_DEMO_SOURCE_FRAGMENTS]);
    vi.advanceTimersByTime(4 * 60 * 1000);
    expect(cache.getFragments()).not.toBeNull();
    expect(cache.getFragments()).toHaveLength(SAFE_DEMO_SOURCE_FRAGMENTS.length);
  });

  it('expires fragments cache after default TTL', () => {
    cache.setFragments([...SAFE_DEMO_SOURCE_FRAGMENTS]);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(cache.getFragments()).toBeNull();
  });

  // ─── Clear ────────────────────────────────────────────────────────────────

  it('clears both registry and fragments caches', () => {
    cache.setRegistry([...INITIAL_SOURCE_REGISTRY]);
    cache.setFragments([...SAFE_DEMO_SOURCE_FRAGMENTS]);
    cache.clear();
    expect(cache.getRegistry()).toBeNull();
    expect(cache.getFragments()).toBeNull();
  });

  it('overwrites existing cache entries', () => {
    const first = [{ ...INITIAL_SOURCE_REGISTRY[0] }];
    cache.setRegistry(first);
    const second = [{ ...INITIAL_SOURCE_REGISTRY[0] }, { ...INITIAL_SOURCE_REGISTRY[0], id: 'second' }];
    cache.setRegistry(second);
    expect(cache.getRegistry()).toHaveLength(2);
  });
});
