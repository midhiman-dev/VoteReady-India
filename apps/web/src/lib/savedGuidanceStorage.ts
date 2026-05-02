import { SavedGuidanceItem, SAVED_GUIDANCE_STORAGE_KEY } from "@voteready/shared";

/**
 * Retrieves all saved guidance items from localStorage.
 * Handles corrupt data by returning an empty array.
 */
export const getSavedGuidance = (): SavedGuidanceItem[] => {
  try {
    const stored = localStorage.getItem(SAVED_GUIDANCE_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    
    // Basic validation: must be an array
    if (!Array.isArray(parsed)) {
      console.warn("Saved guidance data is not an array, resetting.");
      return [];
    }
    
    return parsed as SavedGuidanceItem[];
  } catch (err) {
    console.error("Failed to parse saved guidance from localStorage", err);
    return [];
  }
};

/**
 * Saves a new guidance item to localStorage.
 * If an item with the same ID exists, it is replaced and moved to the top.
 */
export const saveGuidanceItem = (item: SavedGuidanceItem): void => {
  const current = getSavedGuidance();
  // Filter out existing item with same ID if it exists, then prepend new one
  const updated = [item, ...current.filter((i) => i.id !== item.id)];
  
  try {
    localStorage.setItem(SAVED_GUIDANCE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save guidance item to localStorage", err);
  }
};

/**
 * Removes a specific guidance item by ID.
 */
export const removeSavedGuidanceItem = (id: string): void => {
  const current = getSavedGuidance();
  const updated = current.filter((i) => i.id !== id);
  localStorage.setItem(SAVED_GUIDANCE_STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Clears all saved guidance from localStorage.
 */
export const clearAllSavedGuidance = (): void => {
  localStorage.removeItem(SAVED_GUIDANCE_STORAGE_KEY);
};
