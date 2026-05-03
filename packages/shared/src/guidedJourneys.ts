export type GuidedJourneyId =
  | "first_time_voter"
  | "turning_18_soon"
  | "moved_recently"
  | "name_missing"
  | "polling_day_help"
  | "election_basics";

export interface GuidedJourneySummary {
  id: GuidedJourneyId;
  title: string;
  shortDescription: string;
  status: "active";
}

export const GUIDED_JOURNEY_SUMMARIES: readonly GuidedJourneySummary[] = [
  {
    id: "first_time_voter",
    title: "First-time voter",
    shortDescription: "Understanding the path to your first vote.",
    status: "active",
  },
  {
    id: "turning_18_soon",
    title: "Turning 18 soon",
    shortDescription: "Getting ready for requirements and registration.",
    status: "active",
  },
  {
    id: "moved_recently",
    title: "Moved recently",
    shortDescription: "How to update your voter details after moving.",
    status: "active",
  },
  {
    id: "name_missing",
    title: "Name missing from voter list",
    shortDescription: "Steps to take if you can't find your name.",
    status: "active",
  },
  {
    id: "polling_day_help",
    title: "Polling-day help",
    shortDescription: "What to expect and bring to the polling station.",
    status: "active",
  },
  {
    id: "election_basics",
    title: "Election basics",
    shortDescription: "A simple guide to how Indian elections work.",
    status: "active",
  },
];
