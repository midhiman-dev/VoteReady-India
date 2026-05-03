/**
 * Shared formatting utilities for the VoteReady India web application.
 */

/**
 * Formats a snake_case string into Capitalized Words.
 */
export function formatSnakeCase(val: string): string {
  if (!val) return '';
  return val
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a simple string by capitalizing the first letter.
 */
export function formatCapitalize(val: string): string {
  if (!val) return '';
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * Formats an ISO timestamp into a user-friendly locale string.
 */
export function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return ts;
  }
}
