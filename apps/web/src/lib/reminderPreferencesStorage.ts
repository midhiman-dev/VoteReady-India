import { ReminderPreferences, REMINDER_PREFERENCES_STORAGE_KEY } from "@voteready/shared";

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  remindersEnabled: false,
  preferredChannel: "in_app_placeholder",
  timingPreference: "three_days_before_placeholder",
  updatedAt: new Date().toISOString(),
  localOnly: true,
};

/**
 * Retrieves reminder preferences from localStorage.
 * Handles corrupt data by returning default preferences.
 */
export const getReminderPreferences = (): ReminderPreferences => {
  try {
    const stored = localStorage.getItem(REMINDER_PREFERENCES_STORAGE_KEY);
    if (!stored) return DEFAULT_REMINDER_PREFERENCES;
    
    const parsed = JSON.parse(stored);
    
    // Basic validation
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.warn("Reminder preferences data is not a valid object, resetting to default.");
      return DEFAULT_REMINDER_PREFERENCES;
    }
    
    return {
      ...DEFAULT_REMINDER_PREFERENCES,
      ...parsed,
      localOnly: true, // Always force localOnly
    };
  } catch (err) {
    console.error("Failed to parse reminder preferences from localStorage", err);
    return DEFAULT_REMINDER_PREFERENCES;
  }
};

/**
 * Saves reminder preferences to localStorage.
 */
export const saveReminderPreferences = (prefs: Partial<ReminderPreferences>): void => {
  const current = getReminderPreferences();
  const updated: ReminderPreferences = {
    ...current,
    ...prefs,
    updatedAt: new Date().toISOString(),
    localOnly: true,
  };
  
  try {
    localStorage.setItem(REMINDER_PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save reminder preferences to localStorage", err);
  }
};

/**
 * Resets reminder preferences to defaults.
 */
export const resetReminderPreferences = (): void => {
  localStorage.removeItem(REMINDER_PREFERENCES_STORAGE_KEY);
};
