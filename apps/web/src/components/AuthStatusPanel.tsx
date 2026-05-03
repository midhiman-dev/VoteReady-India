import React, { useEffect } from 'react';
import { getFirebaseAuthStatus } from '../lib/firebaseAuthStatus';
import { getAppCheckStatus } from '../lib/appCheckStatus';
import { trackEvent } from '../lib/analytics';

/**
 * A safe, non-functional Account & Sync shell panel.
 * Informs the user that sign-in and cloud sync are not yet active.
 * Follows Task 032: Includes App Check configuration shell status.
 */
export const AuthStatusPanel: React.FC = () => {
  const authStatus = getFirebaseAuthStatus();
  const appCheckStatus = getAppCheckStatus();
  
  useEffect(() => {
    trackEvent('auth_shell_viewed', { 
      authMode: authStatus.providerMode,
      cloudSyncActive: authStatus.cloudSyncActive,
      appCheckEnabled: appCheckStatus.enabled
    });
  }, [authStatus.providerMode, authStatus.cloudSyncActive, appCheckStatus.enabled]);

  return (
    <section className="card auth-status-panel" id="auth-status-panel" aria-labelledby="auth-status-title">
      <div className="panel-header">
        <h2 id="auth-status-title">Account & Sync</h2>
        <span 
          className="auth-status-badge"
          role="status"
          aria-label={`Current status: ${authStatus.statusLabel}`}
        >
          {authStatus.statusLabel}
        </span>
      </div>

      <div className="auth-content">
        <div className="auth-inactive-note" id="sign-in-inactive-message" role="note">
          <p>
            <span className="label">Sign-in Inactive</span>
            Account-based features are not yet active. You do not need to sign in to use VoteReady India.
          </p>
        </div>

        <div className="sync-inactive-note" id="cloud-sync-inactive-message" role="note">
          <p>
            <span className="label">Cloud Sync Inactive</span>
            Cloud synchronization is currently disabled. All your saved guidance and preferences are stored locally on this device.
          </p>
        </div>

        <div className="security-shell-note" id="app-check-status-message" role="note">
          <p>
            <span className="label">Security Readiness</span>
            {appCheckStatus.message}
          </p>
        </div>

        <div className="dev-note" role="note">
          <p>
            <strong>Note:</strong> We do not collect your email, name, or phone number. 
            VoteReady India is designed to be local-first and privacy-preserving.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthStatusPanel;
