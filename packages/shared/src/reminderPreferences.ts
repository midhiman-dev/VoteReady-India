import { IsoDateTimeString } from "./common.js";

export const REMINDER_PREFERENCES_STORAGE_KEY = "voteready.reminderPreferences.v1";

export type ReminderPreferenceChannel =
  | "in_app_placeholder"
  | "email_placeholder"
  | "sms_placeholder";

export type ReminderTimingPreference =
  | "one_day_before_placeholder"
  | "three_days_before_placeholder"
  | "one_week_before_placeholder";

export interface ReminderPreferences {
  remindersEnabled: boolean;
  preferredChannel: ReminderPreferenceChannel;
  timingPreference: ReminderTimingPreference;
  updatedAt: IsoDateTimeString;
  localOnly: true;
}
