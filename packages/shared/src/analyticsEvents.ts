/**
 * Analytics Event Names for VoteReady India
 * 
 * Note: Personal data, raw question text, and full response text are EXPLICITLY FORBIDDEN.
 */
export type AnalyticsEventName =
  | 'assistant_question_submitted'
  | 'assistant_response_received'
  | 'assistant_response_saved'
  | 'saved_guidance_removed'
  | 'saved_guidance_cleared'
  | 'guided_journey_selected'
  | 'guided_journey_back_clicked'
  | 'election_basics_topic_selected'
  | 'election_basics_back_clicked'
  | 'reminder_preferences_saved'
  | 'reminder_preferences_reset'
  | 'auth_panel_viewed'
  | 'sign_in_initiated'
  | 'sign_out_initiated';

/**
 * Analytics Event Payload interface
 * Only allowed non-PII fields.
 */
export interface AnalyticsEventPayload {
  language?: string;
  explanationMode?: string;
  responseStatus?: number | string;
  sourceCount?: number;
  journeyId?: string;
  topicId?: string;
  storageMode?: 'local' | 'cloud';
  cloudSyncActive?: boolean;
  authMode?: string;
  signedIn?: boolean;
  appCheckEnabled?: boolean;
  remindersEnabled?: boolean;
  preferredChannelPlaceholder?: string;
  timingPreferencePlaceholder?: string;
}
