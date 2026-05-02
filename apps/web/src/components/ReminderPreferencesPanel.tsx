import React, { useEffect, useState } from "react";
import { 
  ReminderPreferences, 
  ReminderPreferenceChannel, 
  ReminderTimingPreference 
} from "@voteready/shared";
import { 
  getReminderPreferences, 
  saveReminderPreferences, 
  resetReminderPreferences 
} from "../lib/reminderPreferencesStorage";

/**
 * ReminderPreferencesPanel Component
 * Allows users to locally configure placeholder reminder preferences.
 */
export const ReminderPreferencesPanel: React.FC = () => {
  const [prefs, setPrefs] = useState<ReminderPreferences>(getReminderPreferences());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setPrefs(getReminderPreferences());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveReminderPreferences(prefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your reminder preferences to defaults?")) {
      resetReminderPreferences();
      setPrefs(getReminderPreferences());
      setIsSaved(false);
    }
  };

  const updatePrefs = (update: Partial<ReminderPreferences>) => {
    setPrefs((prev: ReminderPreferences) => ({ ...prev, ...update }));
    setIsSaved(false);
  };

  return (
    <div className="card reminder-preferences-panel" id="reminder-preferences-panel">
      <div className="panel-header">
        <h2>Reminder Preferences</h2>
      </div>

      <div className="safety-note local-only-note">
        <p>
          <strong>Local-only:</strong> Reminder preferences are stored only in this browser. No reminders, emails, SMS, push notifications, or calendar alerts are scheduled yet.
        </p>
      </div>

      <div className="status-note reminder-inactive-note">
        <p>
          <strong>Inactive:</strong> Reminder timing cannot be activated until verified source-backed dates are connected.
        </p>
      </div>

      <form onSubmit={handleSave} className="preferences-form">
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            id="reminders-enabled" 
            checked={prefs.remindersEnabled}
            onChange={(e) => updatePrefs({ remindersEnabled: e.target.checked })}
          />
          <label htmlFor="reminders-enabled">Enable placeholder reminders</label>
        </div>

        <div className="form-group">
          <label htmlFor="preferred-channel">Preferred Channel (Placeholder)</label>
          <select 
            id="preferred-channel" 
            value={prefs.preferredChannel}
            onChange={(e) => updatePrefs({ preferredChannel: e.target.value as ReminderPreferenceChannel })}
          >
            <option value="in_app_placeholder">In-App Placeholder</option>
            <option value="email_placeholder">Email Placeholder</option>
            <option value="sms_placeholder">SMS Placeholder</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timing-preference">Timing Preference (Placeholder)</label>
          <select 
            id="timing-preference" 
            value={prefs.timingPreference}
            onChange={(e) => updatePrefs({ timingPreference: e.target.value as ReminderTimingPreference })}
          >
            <option value="one_day_before_placeholder">1 day before (Placeholder)</option>
            <option value="three_days_before_placeholder">3 days before (Placeholder)</option>
            <option value="one_week_before_placeholder">1 week before (Placeholder)</option>
          </select>
        </div>

        <div className="actions">
          <div className="action-save-group">
            <button type="submit" className="save-btn">
              Save Local Preferences
            </button>
            {isSaved && <span className="save-status">Saved!</span>}
          </div>
          <button type="button" onClick={handleReset} className="reset-btn">
            Reset to Defaults
          </button>
        </div>
      </form>

      <div className="last-updated">
        Last updated: {new Date(prefs.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};
