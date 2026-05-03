import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SavedGuidancePanel } from "./SavedGuidancePanel";
import { 
  fetchSavedGuidance, 
  removeSavedGuidance, 
  clearSavedGuidance,
  getSavedGuidanceRepositoryStatus 
} from "../lib/savedGuidanceRepository";
import { useAuth } from "../lib/AuthContext";
import { SavedGuidanceItem } from "@voteready/shared";

vi.mock("../lib/savedGuidanceRepository", () => ({
  fetchSavedGuidance: vi.fn(),
  removeSavedGuidance: vi.fn(),
  clearSavedGuidance: vi.fn(),
  getSavedGuidanceRepositoryStatus: vi.fn(() => ({
    mode: 'local_storage',
    cloudSyncEnabled: false,
    message: 'Cloud sync is not active yet.'
  })),
}));

vi.mock("../lib/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("SavedGuidancePanel", () => {
  const mockItems: SavedGuidanceItem[] = [
    {
      id: "1",
      question: "Test Question 1",
      responseStatus: "answered",
      language: "simple_english",
      explanationMode: "simple",
      savedTimestamp: new Date().toISOString(),
      shortSummary: "Summary 1",
      sourceCount: 1,
      localOnlyMarker: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: null, loading: false });
    (fetchSavedGuidance as any).mockResolvedValue([]);
  });

  it("renders empty state when no items exist", async () => {
    (fetchSavedGuidance as any).mockResolvedValue([]);
    render(<SavedGuidancePanel />);
    
    await waitFor(() => {
      expect(screen.getByText(/No saved guidance items yet/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Local Storage Only/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud sync is not active yet/i)).toBeInTheDocument();
  });

  it("renders list of saved items", async () => {
    (fetchSavedGuidance as any).mockResolvedValue(mockItems);
    render(<SavedGuidancePanel />);
    
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Test Question 1" })).toBeInTheDocument();
    });
    expect(screen.getByText("Summary 1")).toBeInTheDocument();
    expect(screen.getByLabelText(/status: answered/i)).toBeInTheDocument();
  });

  it("shows cloud sync active when user is signed in", async () => {
    (useAuth as any).mockReturnValue({ user: { uid: 'user-123' }, loading: false });
    (getSavedGuidanceRepositoryStatus as any).mockReturnValue({
      mode: 'firestore_active',
      cloudSyncEnabled: true,
      message: 'Your data is being synced'
    });
    
    render(<SavedGuidancePanel />);
    
    await waitFor(() => {
      expect(screen.getByText(/Cloud Sync Active/i)).toBeInTheDocument();
      expect(screen.getByText(/Your data is being synced/i)).toBeInTheDocument();
    });
  });

  it("calls removeSavedGuidance when remove is clicked", async () => {
    (fetchSavedGuidance as any).mockResolvedValue(mockItems);
    render(<SavedGuidancePanel />);
    
    await waitFor(() => {
      const removeBtn = screen.getByRole("button", { name: /Remove saved guidance for: Test Question 1/i });
      fireEvent.click(removeBtn);
    });
    
    expect(removeSavedGuidance).toHaveBeenCalledWith("1", undefined);
  });

  it("calls clearSavedGuidance when Clear All is clicked and confirmed", async () => {
    (fetchSavedGuidance as any).mockResolvedValue(mockItems);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<SavedGuidancePanel />);
    
    await waitFor(() => {
      const clearBtn = screen.getByRole("button", { name: /Clear all saved guidance items/i });
      fireEvent.click(clearBtn);
    });
    
    expect(clearSavedGuidance).toHaveBeenCalled();
  });
});
