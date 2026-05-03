import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ElectionBasicsExplainer } from "./ElectionBasicsExplainer";
import { ELECTION_BASICS_TOPICS } from "@voteready/shared";

describe("ElectionBasicsExplainer", () => {
  const forbiddenTerms = [
    "Form 6",
    "register by",
    "deadline",
    "eligible if",
    "eligibility criteria",
    "advance registration",
    "voter ID required",
    "polling date",
    "submit this document",
    "carry this document",
    "go to this portal"
  ];

  it("renders the section heading", () => {
    render(<ElectionBasicsExplainer />);
    expect(screen.getByText(/Election Basics Explained/i)).toBeDefined();
  });

  it("renders the source-pending safety note", () => {
    render(<ElectionBasicsExplainer />);
    expect(screen.getByText(/Reviewed official source content must be connected before explanations are shown/i)).toBeDefined();
  });

  it("renders all six topic cards", () => {
    render(<ElectionBasicsExplainer />);
    ELECTION_BASICS_TOPICS.forEach((topic) => {
      expect(screen.getByText(topic.title)).toBeDefined();
      expect(screen.getByText(topic.shortDescription)).toBeDefined();
    });
  });

  it("renders pending status labels for all cards", () => {
    render(<ElectionBasicsExplainer />);
    const labels = screen.getAllByLabelText(/topic status: source backed pending/i);
    expect(labels.length).toBe(ELECTION_BASICS_TOPICS.length);
  });

  it("shows placeholder detail panel when a topic is selected", () => {
    render(<ElectionBasicsExplainer />);
    const topic = ELECTION_BASICS_TOPICS[0];
    const card = screen.getByRole("button", { name: new RegExp(topic.title, "i") });
    fireEvent.click(card);

    expect(screen.getByRole("heading", { name: topic.title, level: 2 })).toBeDefined();
    expect(screen.getByText(/Election basics explainers are not active yet/i)).toBeDefined();
    expect(screen.getByText(/Source-backed explanation pending/i)).toBeDefined();
    expect(screen.getByText(/Reviewed official source content must be connected/i)).toBeDefined();
  });

  it("returns to topic grid when back button is clicked", () => {
    render(<ElectionBasicsExplainer />);
    const card = screen.getByText(ELECTION_BASICS_TOPICS[0].title);
    fireEvent.click(card);
    
    const backButton = screen.getByRole("button", { name: /back to topics/i });
    fireEvent.click(backButton);

    expect(screen.getByText(/Election Basics Explained/i)).toBeDefined();
  });

  it("does not show forbidden procedural guidance in main view", () => {
    render(<ElectionBasicsExplainer />);
    
    forbiddenTerms.forEach(term => {
      expect(screen.queryByText(new RegExp(term, "i"))).toBeNull();
    });
  });

  it("does not show forbidden procedural guidance in detail view", () => {
    render(<ElectionBasicsExplainer />);
    const topic = ELECTION_BASICS_TOPICS[0];
    fireEvent.click(screen.getByText(topic.title));
    
    forbiddenTerms.forEach(term => {
      expect(screen.queryByText(new RegExp(term, "i"))).toBeNull();
    });
  });
});
