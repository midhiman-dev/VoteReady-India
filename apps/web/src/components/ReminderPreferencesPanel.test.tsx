import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReminderPreferencesPanel } from "./ReminderPreferencesPanel";
import * as storage from "../lib/reminderPreferencesStorage";

vi.mock("../lib/reminderPreferencesStorage", () => ({
  getReminderPreferences: vi.fn(),
  saveReminderPreferences: vi.fn(),
  resetReminderPreferences: vi.fn(),
}));

describe("ReminderPreferencesPanel", () => {
  const mockPrefs = {
    remindersEnabled: false,
    preferredChannel: "in_app_placeholder",
    timingPreference: "three_days_before_placeholder",
    updatedAt: new Date().toISOString(),
    localOnly: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default preferences and safety notes", () => {
    vi.mocked(storage.getReminderPreferences).mockReturnValue(mockPrefs as any);
    render(<ReminderPreferencesPanel />);
    
    expect(screen.getByText("Reminder Preferences")).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Active\. Your reminder preferences are saved/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable election reminders/i)).not.toBeChecked();
  });

  it("calls saveReminderPreferences when form is submitted", () => {
    vi.mocked(storage.getReminderPreferences).mockReturnValue(mockPrefs as any);
    render(<ReminderPreferencesPanel />);
    
    const checkbox = screen.getByLabelText(/Enable election reminders/i);
    fireEvent.click(checkbox);
    
    const saveBtn = screen.getByRole("button", { name: /Save local reminder preferences/i });
    fireEvent.click(saveBtn);
    
    expect(storage.saveReminderPreferences).toHaveBeenCalled();
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("calls resetReminderPreferences when reset is clicked and confirmed", () => {
    vi.mocked(storage.getReminderPreferences).mockReturnValue(mockPrefs as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<ReminderPreferencesPanel />);
    
    const resetBtn = screen.getByRole("button", { name: /Reset reminder preferences to defaults/i });
    fireEvent.click(resetBtn);
    
    expect(storage.resetReminderPreferences).toHaveBeenCalled();
  });

  it("does not call resetReminderPreferences when reset is cancelled", () => {
    vi.mocked(storage.getReminderPreferences).mockReturnValue(mockPrefs as any);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ReminderPreferencesPanel />);
    
    const resetBtn = screen.getByRole("button", { name: /Reset reminder preferences to defaults/i });
    fireEvent.click(resetBtn);
    
    expect(storage.resetReminderPreferences).not.toHaveBeenCalled();
  });
});
