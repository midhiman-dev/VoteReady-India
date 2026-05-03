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
    expect(screen.getByText(/provide step-by-step guidance grounded in official election sources/i)).toBeDefined();
  });

  it("renders status labels for all cards", () => {
    render(<GuidedJourneyChooser />);
    const labels = screen.getAllByLabelText(/journey status:/i);
    expect(labels.length).toBe(GUIDED_JOURNEY_SUMMARIES.length);
  });

  it("shows dedicated detail shell when 'Turning 18 soon' is selected", () => {
    render(<GuidedJourneyChooser />);
    const turning18Journey = GUIDED_JOURNEY_SUMMARIES.find(j => j.id === "turning_18_soon")!;
    const card = screen.getByRole("button", { name: new RegExp(turning18Journey.title, "i") });
    fireEvent.click(card);

    // Verify title and status
    expect(screen.getByText(turning18Journey.title)).toBeDefined();
    expect(screen.getByText(/source backed pending/i)).toBeDefined();
    expect(screen.getByText(/Source-backed guidance active/i)).toBeDefined();

    // Verify placeholder section headings
    expect(screen.getByText("Current status")).toBeDefined();
    expect(screen.getByText("What this journey covers")).toBeDefined();
    expect(screen.getByText("Source-backed steps")).toBeDefined();

    // Verify back button
    expect(screen.getByRole("button", { name: /back to journeys/i })).toBeDefined();
  });

  it("shows generic placeholder for other journeys", () => {
    render(<GuidedJourneyChooser />);
    // Select a journey other than Turning 18 soon
    const otherJourney = GUIDED_JOURNEY_SUMMARIES.find(j => j.id !== "turning_18_soon")!;
    const card = screen.getByRole("button", { name: new RegExp(otherJourney.title, "i") });
    fireEvent.click(card);

    expect(screen.getByText(otherJourney.title)).toBeDefined();
    expect(screen.getByText(new RegExp(`Detailed step-by-step guidance for "${otherJourney.title}" is generated based on real-time official sources`, "i"))).toBeDefined();
    
    // Should NOT show the specific turning 18 sections
    expect(screen.queryByText("What this journey covers")).toBeNull();
  });

  it("returns to chooser when back button is clicked", () => {
    render(<GuidedJourneyChooser />);
    const card = screen.getByText(GUIDED_JOURNEY_SUMMARIES[0].title);
    fireEvent.click(card);
    
    const backButton = screen.getByRole("button", { name: /back to journeys/i });
    fireEvent.click(backButton);

    expect(screen.getByText("What applies to me?")).toBeDefined();
  });
});
