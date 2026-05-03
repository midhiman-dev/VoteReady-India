import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthStatusPanel } from './AuthStatusPanel';

// Mock the status helpers
vi.mock('../lib/firebaseAuthStatus', () => ({
  getFirebaseAuthStatus: vi.fn(() => ({
    enabled: false,
    configured: false,
    statusLabel: 'Auth disabled by default',
    signInActive: false,
    cloudSyncActive: false
  }))
}));

vi.mock('../lib/appCheckStatus', () => ({
  getAppCheckStatus: vi.fn(() => ({
    enabled: false,
    configured: false,
    provider: 'disabled',
    enforcementActive: false,
    message: 'App Check: Not active yet'
  }))
}));

describe('AuthStatusPanel', () => {
  it('renders the account & sync header', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText('Account & Sync')).toBeInTheDocument();
  });

  it('shows sign-in inactive messaging', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText(/Sign-in Inactive/i)).toBeInTheDocument();
    expect(screen.getByText(/Account-based features are not yet active/i)).toBeInTheDocument();
  });

  it('shows cloud sync inactive messaging', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText(/Cloud Sync Inactive/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud synchronization is currently disabled/i)).toBeInTheDocument();
  });

  it('shows App Check inactive messaging', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText(/Security Readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/App Check: Not active yet/i)).toBeInTheDocument();
  });

  it('displays the status label from the helper', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText('Auth disabled by default')).toBeInTheDocument();
  });

  it('does not render any sign-in forms or identity input fields', () => {
    const { container } = render(<AuthStatusPanel />);
    const inputs = container.querySelectorAll('input');
    const buttons = container.querySelectorAll('button');
    
    expect(inputs.length).toBe(0);
    // There might be buttons in other components but not in this specific panel shell for Task 030
    expect(buttons.length).toBe(0);
  });
});
