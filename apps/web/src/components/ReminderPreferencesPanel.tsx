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
import { trackEvent } from "../lib/analytics";

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
    
    trackEvent('reminder_preferences_saved', {
      remindersEnabled: prefs.remindersEnabled,
      preferredChannelPlaceholder: prefs.preferredChannel,
      timingPreferencePlaceholder: prefs.timingPreference
    });

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your reminder preferences to defaults?")) {
      resetReminderPreferences();
      setPrefs(getReminderPreferences());
      setIsSaved(false);
      trackEvent('reminder_preferences_reset');
    }
  };

  const updatePrefs = (update: Partial<ReminderPreferences>) => {
    setPrefs((prev: ReminderPreferences) => ({ ...prev, ...update }));
    setIsSaved(false);
  };

  return (
    <section className="card reminder-preferences-panel" id="reminder-preferences-panel" aria-labelledby="reminder-preferences-title">
      <div className="panel-header">
        <h2 id="reminder-preferences-title">Reminder Preferences</h2>
      </div>

      <div className="safety-note local-only-note" role="note">
        <p>
          <strong>Status:</strong> Active. Your reminder preferences are saved. When a signed-in session is active, these sync to your account.
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
          <label htmlFor="reminders-enabled">Enable election reminders</label>
        </div>

        <div className="form-group">
          <label htmlFor="preferred-channel">Preferred Channel</label>
          <select 
            id="preferred-channel" 
            value={prefs.preferredChannel}
            onChange={(e) => updatePrefs({ preferredChannel: e.target.value as ReminderPreferenceChannel })}
          >
            <option value="in_app_placeholder">In-App Notification</option>
            <option value="email_placeholder">Email</option>
            <option value="sms_placeholder">SMS</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timing-preference">Timing Preference</label>
          <select 
            id="timing-preference" 
            value={prefs.timingPreference}
            onChange={(e) => updatePrefs({ timingPreference: e.target.value as ReminderTimingPreference })}
          >
            <option value="one_day_before_placeholder">1 day before</option>
            <option value="three_days_before_placeholder">3 days before</option>
            <option value="one_week_before_placeholder">1 week before</option>
          </select>
        </div>

        <div className="actions">
          <div className="action-save-group">
            <button type="submit" className="save-btn" aria-label="Save local reminder preferences">
              Save Local Preferences
            </button>
            <div aria-live="polite" aria-atomic="true">
              {isSaved && <span className="save-status" role="status">Saved!</span>}
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleReset} 
            className="reset-btn"
            aria-label="Reset reminder preferences to defaults"
          >
            Reset to Defaults
          </button>
        </div>
      </form>

      <div className="last-updated">
        Last updated:{' '}
        <time dateTime={new Date(prefs.updatedAt).toISOString()}>
          {new Date(prefs.updatedAt).toLocaleString()}
        </time>
      </div>
    </section>
  );
};
