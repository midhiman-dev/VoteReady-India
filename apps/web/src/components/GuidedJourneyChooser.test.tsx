import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuidedJourneyChooser } from "./GuidedJourneyChooser";
import { GUIDED_JOURNEY_SUMMARIES } from "@voteready/shared";

describe("GuidedJourneyChooser", () => {
  it("renders the section heading", () => {
    render(<GuidedJourneyChooser />);
    expect(screen.getByText("What applies to me?")).toBeDefined();
  });

  it("renders all six journey cards", () => {
    render(<GuidedJourneyChooser />);
    GUIDED_JOURNEY_SUMMARIES.forEach((journey) => {
      expect(screen.getByText(journey.title)).toBeDefined();
      expect(screen.getByText(journey.shortDescription)).toBeDefined();
    });
  });

  it("renders the safety note", () => {
    render(<GuidedJourneyChooser />);
    expect(screen.getByText(/Verified source-backed journey guidance is not active yet/i)).toBeDefined();
  });

  it("renders status labels for all cards", () => {
    render(<GuidedJourneyChooser />);
    const labels = screen.getAllByText(/source backed pending/i);
    expect(labels.length).toBe(GUIDED_JOURNEY_SUMMARIES.length);
  });

  it("shows placeholder panel when a journey is selected", () => {
    render(<GuidedJourneyChooser />);
    const firstJourney = GUIDED_JOURNEY_SUMMARIES[0];
    const card = screen.getByText(firstJourney.title);
    fireEvent.click(card);

    expect(screen.getByText(/This journey is not active yet/i)).toBeDefined();
    expect(screen.getByText(/Future tasks will connect reviewed source content/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /back to journeys/i })).toBeDefined();
  });

  it("does not show unsafe procedural guidance", () => {
    render(<GuidedJourneyChooser />);
    
    const unsafeTerms = [
      "deadline",
      "Form 6",
      "eligible",
      "eligibility",
      "polling date",
      "register by",
      "voter ID required"
    ];

    unsafeTerms.forEach(term => {
      expect(screen.queryByText(new RegExp(term, "i"))).toBeNull();
    });
  });
});
