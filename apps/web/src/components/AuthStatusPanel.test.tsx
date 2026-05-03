import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthStatusPanel } from './AuthStatusPanel';
import { useAuth } from '../lib/AuthContext';

// Mock the status helpers
vi.mock('../lib/firebaseAuthStatus', () => ({
  getFirebaseAuthStatus: vi.fn(() => ({
    enabled: true,
    configured: true,
    statusLabel: 'Auth Active',
    signInActive: true,
    cloudSyncActive: true
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

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../lib/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    loading: false,
    signIn: mockSignIn,
    signOut: mockSignOut,
    isConfigured: true
  }))
}));

describe('AuthStatusPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: mockSignOut,
      isConfigured: true
    });
  });

  it('renders the account & sync header', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByText('Account & Sync')).toBeInTheDocument();
  });

  it('shows sign-in button when configured but not signed in', () => {
    render(<AuthStatusPanel />);
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it('calls signIn when sign-in button is clicked', () => {
    render(<AuthStatusPanel />);
    const signInBtn = screen.getByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(signInBtn);
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('shows user info and sign-out button when signed in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/photo.jpg'
      } as any,
      loading: false,
      signIn: mockSignIn,
      signOut: mockSignOut,
      isConfigured: true
    });

    render(<AuthStatusPanel />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  it('calls signOut when sign-out button is clicked', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { displayName: 'Test User' } as any,
      loading: false,
      signIn: mockSignIn,
      signOut: mockSignOut,
      isConfigured: true
    });

    render(<AuthStatusPanel />);
    const signOutBtn = screen.getByText(/Sign Out/i);
    fireEvent.click(signOutBtn);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
