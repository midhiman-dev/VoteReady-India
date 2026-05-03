import { SourceRecord } from "./source.js";

/**
 * Static seed of approved official source surfaces for VoteReady India.
 * This registry acts as a safe metadata layer for future ingestion and assistant grounding.
 */
export const INITIAL_SOURCE_REGISTRY: readonly SourceRecord[] = [
  {
    id: "eci-official-website",
    title: "Election Commission of India (Official Website)",
    sourceType: "eci_official",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    url: "https://eci.gov.in",
    freshnessStatus: "review_due",
    summary: "Official national election information source surface for future source-backed guidance."
  },
  {
    id: "voters-services-portal",
    title: "Voters’ Services Portal",
    sourceType: "voters_services_portal",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    url: "https://voters.eci.gov.in",
    freshnessStatus: "review_due",
    summary: "Official voter-service source surface for future registration, status, and voter-service guidance."
  },
  {
    id: "electoral-search",
    title: "Electoral Search",
    sourceType: "eci_utility",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    url: "https://electoralsearch.eci.gov.in",
    freshnessStatus: "review_due",
    summary: "Official utility surface for searching voter names in the electoral roll."
  },
  {
    id: "electoral-roll-download",
    title: "Electoral Roll Download",
    sourceType: "eci_utility",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    freshnessStatus: "review_due",
    summary: "Official service surface for downloading state-wise electoral rolls."
  },
  {
    id: "eci-results-site",
    title: "Official ECI Results Site",
    sourceType: "eci_utility",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    url: "https://results.eci.gov.in",
    freshnessStatus: "review_due",
    summary: "Official source for election results and counting data trends."
  },
  {
    id: "eci-archive",
    title: "ECI Archive",
    sourceType: "eci_official",
    jurisdictionLevel: "national",
    publisher: "Election Commission of India",
    freshnessStatus: "review_due",
    summary: "Official historical archive for past election notifications and data."
  },
  {
    id: "gov-open-data",
    title: "Government Open Data Election Resources",
    sourceType: "government_open_data",
    jurisdictionLevel: "national",
    publisher: "data.gov.in",
    url: "https://data.gov.in",
    freshnessStatus: "review_due",
    summary: "Official datasets related to election statistics and public datasets."
  }
];

/**
 * Finds a source record by its unique identifier.
 * @param sourceId The ID of the source to find.
 * @param registry The registry to search (defaults to INITIAL_SOURCE_REGISTRY).
 */
export function findSourceRecordById(
  sourceId: string,
  registry: readonly SourceRecord[] = INITIAL_SOURCE_REGISTRY
): SourceRecord | undefined {
  return registry.find((source) => source.id === sourceId);
}
