import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SavedGuidancePanel } from "./SavedGuidancePanel";
import * as storage from "../lib/savedGuidanceStorage";
import { SavedGuidanceItem } from "@voteready/shared";

vi.mock("../lib/savedGuidanceStorage", () => ({
  getSavedGuidance: vi.fn(),
  removeSavedGuidanceItem: vi.fn(),
  clearAllSavedGuidance: vi.fn(),
}));

vi.mock("../lib/savedGuidanceRepository", () => ({
  getSavedGuidanceRepositoryStatus: vi.fn(() => ({
    mode: 'local_storage',
    cloudSyncEnabled: false,
    message: 'Cloud sync is not active yet.'
  })),
}));

describe("SavedGuidancePanel", () => {
  const mockItems: SavedGuidanceItem[] = [
    {
      id: "1",
      question: "Test Question 1",
      responseStatus: "answered",
      language: "english",
      explanationMode: "simple",
      savedTimestamp: new Date().toISOString(),
      shortSummary: "Summary 1",
      sourceCount: 1,
      localOnlyMarker: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no items exist", () => {
    vi.mocked(storage.getSavedGuidance).mockReturnValue([]);
    render(<SavedGuidancePanel />);
    expect(screen.getByText(/No saved guidance items yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved guidance is stored locally in this browser/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud sync is not active yet/i)).toBeInTheDocument();
  });

  it("renders list of saved items", () => {
    vi.mocked(storage.getSavedGuidance).mockReturnValue(mockItems);
    render(<SavedGuidancePanel />);
    expect(screen.getByRole("heading", { name: "Test Question 1" })).toBeInTheDocument();
    expect(screen.getByText("Summary 1")).toBeInTheDocument();
    expect(screen.getByLabelText(/status: answered/i)).toBeInTheDocument();
  });

  it("calls removeSavedGuidanceItem when remove is clicked", () => {
    vi.mocked(storage.getSavedGuidance).mockReturnValue(mockItems);
    render(<SavedGuidancePanel />);
    const removeBtn = screen.getByRole("button", { name: /Remove saved guidance for: Test Question 1/i });
    fireEvent.click(removeBtn);
    expect(storage.removeSavedGuidanceItem).toHaveBeenCalledWith("1");
  });

  it("calls clearAllSavedGuidance when Clear All is clicked and confirmed", () => {
    vi.mocked(storage.getSavedGuidance).mockReturnValue(mockItems);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<SavedGuidancePanel />);
    const clearBtn = screen.getByRole("button", { name: /Clear all saved guidance items/i });
    fireEvent.click(clearBtn);
    expect(storage.clearAllSavedGuidance).toHaveBeenCalled();
  });

  it("does not call clearAllSavedGuidance when Clear All is clicked but cancelled", () => {
    vi.mocked(storage.getSavedGuidance).mockReturnValue(mockItems);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<SavedGuidancePanel />);
    const clearBtn = screen.getByRole("button", { name: /Clear all saved guidance items/i });
    fireEvent.click(clearBtn);
    expect(storage.clearAllSavedGuidance).not.toHaveBeenCalled();
  });
});
