import {
  AppEnvironment,
  IsoDateTimeString,
  LanguagePreference,
  ExplanationMode,
} from "./common.js";
import { SourceRecord } from "./source.js";

export interface AppMetadataResponse {
  appName: string;
  tagline: string;
  apiVersion: string;
  environment: AppEnvironment;
  supportedLanguages: readonly LanguagePreference[];
  supportedExplanationModes: readonly ExplanationMode[];
  generatedAt: IsoDateTimeString;
}

export interface SourceRegistryResponse {
  sources: readonly SourceRecord[];
  count: number;
  generatedAt: IsoDateTimeString;
}
