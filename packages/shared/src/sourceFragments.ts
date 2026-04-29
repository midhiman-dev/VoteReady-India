import { IsoDateTimeString, LanguagePreference } from "./common";
import { SourceFreshnessStatus } from "./source";

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
