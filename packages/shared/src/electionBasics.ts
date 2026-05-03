/**
 * Election Basics Topic Identifiers
 */
export type ElectionBasicsTopicId =
  | "how_voting_works"
  | "election_types"
  | "electoral_rolls"
  | "constituency_basics"
  | "polling_day_flow"
  | "official_sources";

/**
 * Election Basics Topic Summary
 */
export interface ElectionBasicsTopicSummary {
  id: ElectionBasicsTopicId;
  title: string;
  shortDescription: string;
  status: "active";
}

/**
 * Election Basics Topics List
 */
export const ELECTION_BASICS_TOPICS: readonly ElectionBasicsTopicSummary[] = [
  {
    id: "how_voting_works",
    title: "How voting works",
    shortDescription: "A simple overview of the voting process in India.",
    status: "active",
  },
  {
    id: "election_types",
    title: "Election types",
    shortDescription: "Understand the different types of elections in India.",
    status: "active",
  },
  {
    id: "electoral_rolls",
    title: "Electoral rolls",
    shortDescription: "What is a voter list and why it matters for you.",
    status: "active",
  },
  {
    id: "constituency_basics",
    title: "Constituency basics",
    shortDescription: "How areas are divided for voting purposes.",
    status: "active",
  },
  {
    id: "polling_day_flow",
    title: "Polling-day flow",
    shortDescription: "What to expect when you go to vote.",
    status: "active",
  },
  {
    id: "official_sources",
    title: "Official sources",
    shortDescription: "Where to find official information from the ECI.",
    status: "active",
  },
];
