import { SourceRecord, SourceFragment } from '@voteready/shared';

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getTtlMs(): number {
  const raw = process.env.SOURCE_CACHE_TTL_MS;
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_TTL_MS;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Minimal in-memory TTL cache for source data.
 * Reduces repeated Firestore reads on every assistant request.
 * Safe fallback: if cache is empty or expired, caller re-fetches from Firestore.
 */
export class SourceCache {
  private registryEntry: CacheEntry<SourceRecord[]> | null = null;
  private fragmentsEntry: CacheEntry<SourceFragment[]> | null = null;

  getRegistry(): SourceRecord[] | null {
    if (!this.registryEntry) return null;
    if (Date.now() > this.registryEntry.expiresAt) {
      this.registryEntry = null;
      return null;
    }
    return this.registryEntry.value;
  }

  setRegistry(value: SourceRecord[]): void {
    this.registryEntry = {
      value,
      expiresAt: Date.now() + getTtlMs(),
    };
  }

  getFragments(): SourceFragment[] | null {
    if (!this.fragmentsEntry) return null;
    if (Date.now() > this.fragmentsEntry.expiresAt) {
      this.fragmentsEntry = null;
      return null;
    }
    return this.fragmentsEntry.value;
  }

  setFragments(value: SourceFragment[]): void {
    this.fragmentsEntry = {
      value,
      expiresAt: Date.now() + getTtlMs(),
    };
  }

  /** Clears all cache entries (useful for tests). */
  clear(): void {
    this.registryEntry = null;
    this.fragmentsEntry = null;
  }
}

/** Shared singleton cache for the API process lifetime. */
export const sourceCache = new SourceCache();
