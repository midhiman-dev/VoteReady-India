import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  getSavedGuidance, 
  saveGuidanceItem, 
  removeSavedGuidanceItem, 
  clearAllSavedGuidance 
} from "./savedGuidanceStorage";
import { SavedGuidanceItem, SAVED_GUIDANCE_STORAGE_KEY } from "@voteready/shared";

describe("savedGuidanceStorage", () => {
  const mockItem: SavedGuidanceItem = {
    id: "test-id",
    question: "How do I vote?",
    responseStatus: "answered",
    language: "english",
    explanationMode: "simple",
    savedTimestamp: "2026-05-02T12:00:00Z",
    shortSummary: "Summary...",
    sourceCount: 2,
    localOnlyMarker: true
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns empty array when no data exists", () => {
    expect(getSavedGuidance()).toEqual([]);
  });

  it("saves and retrieves an item", () => {
    saveGuidanceItem(mockItem);
    const items = getSavedGuidance();
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(mockItem);
  });

  it("updates an existing item with the same ID", () => {
    saveGuidanceItem(mockItem);
    const updatedItem = { ...mockItem, question: "Updated?" };
    saveGuidanceItem(updatedItem);
    
    const items = getSavedGuidance();
    expect(items).toHaveLength(1);
    expect(items[0].question).toBe("Updated?");
  });

  it("removes an item by ID", () => {
    saveGuidanceItem(mockItem);
    removeSavedGuidanceItem(mockItem.id);
    expect(getSavedGuidance()).toHaveLength(0);
  });

  it("clears all items", () => {
    saveGuidanceItem(mockItem);
    saveGuidanceItem({ ...mockItem, id: "id-2" });
    clearAllSavedGuidance();
    expect(getSavedGuidance()).toHaveLength(0);
  });

  it("handles corrupt JSON safely", () => {
    localStorage.setItem(SAVED_GUIDANCE_STORAGE_KEY, "invalid-json");
    expect(getSavedGuidance()).toEqual([]);
  });

  it("handles non-array data safely", () => {
    localStorage.setItem(SAVED_GUIDANCE_STORAGE_KEY, JSON.stringify({ not: "an-array" }));
    expect(getSavedGuidance()).toEqual([]);
  });
});
