import { SourceFragment } from "./sourceFragments.js";

export const SAFE_DEMO_SOURCE_FRAGMENTS: readonly SourceFragment[] = [
  {
    id: "demo-fragment-1",
    sourceId: "eci-official-website",
    title: "Source Transparency",
    content: "VoteReady India uses approved source surfaces as references for future source-backed guidance. A source record alone is not the same as a verified answer.",
    language: "english",
    tags: ["transparency", "safety"],
    freshnessStatus: "unverified",
    useScope: "demo_safe"
  },
  {
    id: "demo-fragment-2",
    sourceId: "eci-official-website",
    title: "Freshness Caution",
    content: "Information marked review due should be checked through an approved verification workflow before it is used for current procedural guidance.",
    language: "english",
    tags: ["freshness", "safety"],
    freshnessStatus: "review_due",
    useScope: "demo_safe"
  },
  {
    id: "demo-fragment-3",
    sourceId: "voters-services-portal",
    title: "Assistant Readiness",
    content: "The assistant should only provide procedural election guidance when the relevant source content is available, reviewed, and connected to the answer flow.",
    language: "english",
    tags: ["readiness", "safety"],
    freshnessStatus: "unverified",
    useScope: "demo_safe"
  }
];

export function getSourceFragmentsBySourceId(
  sourceId: string,
  fragments: readonly SourceFragment[] = SAFE_DEMO_SOURCE_FRAGMENTS
): readonly SourceFragment[] {
  return fragments.filter((f) => f.sourceId === sourceId);
}

export function getDemoSourceFragmentById(
  fragmentId: string,
  fragments: readonly SourceFragment[] = SAFE_DEMO_SOURCE_FRAGMENTS
): SourceFragment | undefined {
  return fragments.find((f) => f.id === fragmentId);
}
