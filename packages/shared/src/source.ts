import { IsoDateTimeString } from "./common.js";

export type SourceType =
  | "eci_official"
  | "voters_services_portal"
  | "eci_utility"
  | "government_open_data"
  | "curated_derived";

export type SourceFreshnessStatus =
  | "verified"
  | "review_due"
  | "stale"
  | "archived"
  | "unverified";

export type JurisdictionLevel =
  | "national"
  | "state"
  | "constituency"
  | "local"
  | "unknown";

export interface SourceRecord {
  id: string;
  title: string;
  sourceType: SourceType;
  jurisdictionLevel: JurisdictionLevel;
  jurisdictionName?: string;
  publisher?: string;
  url?: string;
  freshnessStatus: SourceFreshnessStatus;
  lastVerifiedAt?: IsoDateTimeString;
  lastCheckedAt?: IsoDateTimeString;
  summary?: string;
}
