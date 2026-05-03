import { IsoDateTimeString, LanguagePreference } from "./common.js";
import { SourceFreshnessStatus } from "./source.js";

export type SourceFragmentUseScope =
  | "demo_safe"
  | "assistant_grounding_candidate"
  | "not_for_user_guidance";

export interface SourceFragment {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  language: LanguagePreference;
  tags: readonly string[];
  freshnessStatus: SourceFreshnessStatus;
  useScope: SourceFragmentUseScope;
  lastReviewedAt?: IsoDateTimeString;
  notes?: string;
}
