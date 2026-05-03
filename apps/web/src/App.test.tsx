import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as apiClient from './lib/apiClient';
import { useAuth } from './lib/AuthContext';

// Mock child components to isolate App testing
vi.mock('./components/AssistantShell', () => ({
  default: () => <div data-testid="assistant-shell">Assistant Shell</div>
}));

vi.mock('./components/GuidedJourneyChooser', () => ({
  GuidedJourneyChooser: () => <div data-testid="journey-chooser">Journey Chooser</div>
}));

vi.mock('./components/ElectionBasicsExplainer', () => ({
  ElectionBasicsExplainer: () => <div data-testid="basics-explainer">Basics Explainer</div>
}));

vi.mock('./components/SavedGuidancePanel', () => ({
  SavedGuidancePanel: () => <div data-testid="saved-panel">Saved Panel</div>
}));

vi.mock('./components/ReminderPreferencesPanel', () => ({
  ReminderPreferencesPanel: () => <div data-testid="reminder-panel">Reminder Panel</div>
}));

vi.mock('./components/AuthStatusPanel', () => ({
  AuthStatusPanel: () => <div data-testid="auth-panel">Auth Panel</div>
}));

vi.mock('./components/ApiStatusCard', () => ({
  default: () => <div data-testid="api-status-card">Api Status Card</div>
}));

vi.mock('./components/SourceRegistryPreview', () => ({
  default: () => <div data-testid="source-registry-preview">Source Registry Preview</div>
}));

// Mock Auth
vi.mock('./lib/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock API Client
vi.mock('./lib/apiClient', () => ({
  getAppMetadata: vi.fn(),
  getSourceRegistry: vi.fn(),
}));

describe('App Main Shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: null, loading: false });
    
    // Default API mocks
    vi.mocked(apiClient.getAppMetadata).mockResolvedValue({
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: []
    });
    vi.mocked(apiClient.getSourceRegistry).mockResolvedValue({
      sources: [],
      lastUpdated: new Date().toISOString()
    });
  });

  it('renders the app shell and default Ask tab immediately without blocking on metadata', () => {
    // Delay API response to ensure it's non-blocking
    vi.mocked(apiClient.getAppMetadata).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({} as any), 100)));

    render(<App />);

    // Header and navigation should be present
    expect(screen.getByText(/VoteReady India/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Default tab (Ask) should be rendered immediately
    expect(screen.getByTestId('assistant-shell')).toBeInTheDocument();
  });

  it('switches tabs correctly when navigation buttons are clicked', async () => {
    render(<App />);

    // Switch to Journeys
    const journeysBtn = screen.getByRole('button', { name: /🗺️ Journeys/i });
    fireEvent.click(journeysBtn);
    expect(await screen.findByTestId('journey-chooser')).toBeInTheDocument();

    // Switch to Basics
    const basicsBtn = screen.getByRole('button', { name: /📚 Basics/i });
    fireEvent.click(basicsBtn);
    expect(await screen.findByTestId('basics-explainer')).toBeInTheDocument();

    // Switch to Saved
    const savedBtn = screen.getByRole('button', { name: /🔖 Saved/i });
    fireEvent.click(savedBtn);
    expect(await screen.findByTestId('saved-panel')).toBeInTheDocument();

    // Switch to Settings
    const settingsBtn = screen.getByRole('button', { name: /⚙️ Settings/i });
    fireEvent.click(settingsBtn);
    expect(await screen.findByRole('heading', { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByTestId('auth-panel')).toBeInTheDocument();
  });

  it('handles API metadata errors gracefully without crashing the shell', async () => {
    vi.mocked(apiClient.getAppMetadata).mockRejectedValue(new Error('API Down'));

    render(<App />);

    // Shell still works
    expect(screen.getByText(/VoteReady India/i)).toBeInTheDocument();
    expect(screen.getByTestId('assistant-shell')).toBeInTheDocument();

    // Error should be visible in settings
    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    settingsBtn.click();
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to reach the API metadata service/i)).toBeInTheDocument();
    });
  });
});
