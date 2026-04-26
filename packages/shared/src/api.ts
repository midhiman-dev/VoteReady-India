import {
  AppEnvironment,
  IsoDateTimeString,
  LanguagePreference,
  ExplanationMode,
} from "./common";
import { SourceRecord } from "./source";

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
