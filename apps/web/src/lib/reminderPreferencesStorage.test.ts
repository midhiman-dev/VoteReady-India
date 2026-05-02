import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  getReminderPreferences, 
  saveReminderPreferences, 
  resetReminderPreferences,
  DEFAULT_REMINDER_PREFERENCES
} from "./reminderPreferencesStorage";
import { REMINDER_PREFERENCES_STORAGE_KEY } from "@voteready/shared";

describe("reminderPreferencesStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns default preferences when no data exists", () => {
    expect(getReminderPreferences()).toEqual(DEFAULT_REMINDER_PREFERENCES);
  });

  it("saves and retrieves preferences", () => {
    const newPrefs = { remindersEnabled: true, preferredChannel: "email_placeholder" as const };
    saveReminderPreferences(newPrefs);
    const stored = getReminderPreferences();
    expect(stored.remindersEnabled).toBe(true);
    expect(stored.preferredChannel).toBe("email_placeholder");
    expect(stored.localOnly).toBe(true);
  });

  it("resets preferences to default", () => {
    saveReminderPreferences({ remindersEnabled: true });
    resetReminderPreferences();
    expect(getReminderPreferences()).toEqual(DEFAULT_REMINDER_PREFERENCES);
  });

  it("handles corrupt JSON safely", () => {
    localStorage.setItem(REMINDER_PREFERENCES_STORAGE_KEY, "invalid-json");
    expect(getReminderPreferences()).toEqual(DEFAULT_REMINDER_PREFERENCES);
  });

  it("handles non-object data safely", () => {
    localStorage.setItem(REMINDER_PREFERENCES_STORAGE_KEY, JSON.stringify(["not", "an", "object"]));
    expect(getReminderPreferences()).toEqual(DEFAULT_REMINDER_PREFERENCES);
  });

  it("ensures localOnly is always true", () => {
    // Manually set a corrupt state where localOnly is false
    localStorage.setItem(REMINDER_PREFERENCES_STORAGE_KEY, JSON.stringify({ ...DEFAULT_REMINDER_PREFERENCES, localOnly: false }));
    const stored = getReminderPreferences();
    expect(stored.localOnly).toBe(true);
  });
});
