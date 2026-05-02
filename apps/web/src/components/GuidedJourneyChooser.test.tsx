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

  it("shows dedicated detail shell when 'Turning 18 soon' is selected", () => {
    render(<GuidedJourneyChooser />);
    const turning18Journey = GUIDED_JOURNEY_SUMMARIES.find(j => j.id === "turning_18_soon")!;
    const card = screen.getByText(turning18Journey.title);
    fireEvent.click(card);

    // Verify title and status
    expect(screen.getByText(turning18Journey.title)).toBeDefined();
    expect(screen.getByText(/Source-backed guidance pending/i)).toBeDefined();
    expect(screen.getByText(/This journey is not active yet/i)).toBeDefined();

    // Verify placeholder section headings
    expect(screen.getByText("Current status")).toBeDefined();
    expect(screen.getByText("What this journey will help with")).toBeDefined();
    expect(screen.getByText("Source-backed steps pending")).toBeDefined();
    expect(screen.getByText("What comes next")).toBeDefined();

    // Verify back button
    expect(screen.getByRole("button", { name: /back to journeys/i })).toBeDefined();
  });

  it("shows generic placeholder for other journeys", () => {
    render(<GuidedJourneyChooser />);
    // Select a journey other than Turning 18 soon
    const otherJourney = GUIDED_JOURNEY_SUMMARIES.find(j => j.id !== "turning_18_soon")!;
    const card = screen.getByText(otherJourney.title);
    fireEvent.click(card);

    expect(screen.getByText(otherJourney.title)).toBeDefined();
    expect(screen.getByText(new RegExp(`Future tasks will connect reviewed source content for the "${otherJourney.title}" journey`, "i"))).toBeDefined();
    
    // Should NOT show the specific turning 18 sections
    expect(screen.queryByText("What this journey will help with")).toBeNull();
  });

  it("returns to chooser when back button is clicked", () => {
    render(<GuidedJourneyChooser />);
    const card = screen.getByText(GUIDED_JOURNEY_SUMMARIES[0].title);
    fireEvent.click(card);
    
    const backButton = screen.getByRole("button", { name: /back to journeys/i });
    fireEvent.click(backButton);

    expect(screen.getByText("What applies to me?")).toBeDefined();
  });

  it("does not show forbidden procedural guidance in Turning 18 detail shell", () => {
    render(<GuidedJourneyChooser />);
    const turning18Journey = GUIDED_JOURNEY_SUMMARIES.find(j => j.id === "turning_18_soon")!;
    fireEvent.click(screen.getByText(turning18Journey.title));
    
    const forbiddenTerms = [
      "Form 6",
      "register by",
      "deadline",
      "eligible if",
      "eligibility criteria",
      "advance registration",
      "voter ID required",
      "polling date",
      "submit this document"
    ];

    forbiddenTerms.forEach(term => {
      expect(screen.queryByText(new RegExp(term, "i"))).toBeNull();
    });
  });
});
