import { AppEnvironment } from '@voteready/shared';

/**
 * Safely maps NODE_ENV to validated AppEnvironment label.
 */
export function getAppEnvironment(): AppEnvironment {
  const env = process.env.NODE_ENV;
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  if (env === 'development') return 'development';
  return 'local';
}
