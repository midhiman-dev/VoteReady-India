import React, { useEffect } from 'react';
import { getFirebaseAuthStatus } from '../lib/firebaseAuthStatus';
import { getAppCheckStatus } from '../lib/appCheckStatus';
import { trackEvent } from '../lib/analytics';
import { useAuth } from '../lib/AuthContext';

/**
 * Account & Sync panel.
 * Shows sign-in status and provides Google Sign-In/Sign-Out actions.
 */
export const AuthStatusPanel: React.FC = () => {
  const authStatus = getFirebaseAuthStatus();
  const appCheckStatus = getAppCheckStatus();
  const { user, loading, signIn, signOut, isConfigured } = useAuth();
  
  

  useEffect(() => {
    trackEvent('auth_panel_viewed', { 
      authMode: authStatus.providerMode,
      cloudSyncActive: authStatus.cloudSyncActive,
      appCheckEnabled: appCheckStatus.enabled,
      signedIn: !!user
    });
  }, [authStatus.providerMode, authStatus.cloudSyncActive, appCheckStatus.enabled, user]);

  const handleSignIn = async () => {
    try {
      await signIn();
      trackEvent('sign_in_initiated');
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      trackEvent('sign_out_initiated');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <section className="card auth-status-panel" id="auth-status-panel" aria-labelledby="auth-status-title">
      <div className="panel-header">
        <h2 id="auth-status-title">Account & Sync</h2>
        <span 
          className={`auth-status-badge ${user ? 'active' : ''}`}
          role="status"
          aria-label={`Current status: ${user ? 'Signed In' : authStatus.statusLabel}`}
        >
          {user ? 'Signed In' : authStatus.statusLabel}
        </span>
      </div>

      <div className="auth-content">
        {loading ? (
          <div className="auth-loading">Checking auth state...</div>
        ) : user ? (
          <div className="user-profile">
            <div className="user-info">
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="user-avatar" />
              )}
              <div className="user-details">
                <p className="user-name">{user.displayName || 'Anonymous User'}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="btn btn-secondary sign-out-btn"
              id="sign-out-button"
            >
              Sign Out
            </button>
          </div>
        ) : isConfigured ? (
          <div className="auth-active">
            <p className="auth-desc">
              Sign in with Google to sync your saved guidance across devices.
            </p>
            <button 
              onClick={handleSignIn}
              className="btn btn-primary sign-in-btn"
              id="sign-in-button"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="auth-inactive-note" id="sign-in-inactive-message" role="note">
            <p>
              <span className="label">Sign-in Inactive</span>
              Account-based features are not yet active. You do not need to sign in to use VoteReady India.
            </p>
          </div>
        )}

        {(!user || !isConfigured) && (
          <div className="sync-inactive-note" id="cloud-sync-inactive-message" role="note">
            <p>
              <span className="label">Cloud Sync Inactive</span>
              Cloud synchronization is currently disabled. All your saved guidance and preferences are stored locally on this device.
            </p>
          </div>
        )}

        {user && isConfigured && (
          <div className="sync-active-note" id="cloud-sync-active-message" role="note">
            <p>
              <span className="label">Cloud Sync Ready</span>
              Your guidance and preferences can now be synced to your account.
            </p>
          </div>
        )}

        <div className="security-shell-note" id="app-check-status-message" role="note">
          <p>
            <span className="label">Security Readiness</span>
            {appCheckStatus.message}
          </p>
        </div>

        <div className="dev-note" role="note">
          <p>
            <strong>Note:</strong> VoteReady India is designed to be local-first. 
            Sign-in is optional and we prioritize your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthStatusPanel;
