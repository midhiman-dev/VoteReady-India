import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ElectionBasicsExplainer } from "./ElectionBasicsExplainer";
import { ELECTION_BASICS_TOPICS } from "@voteready/shared";

describe("ElectionBasicsExplainer", () => {
  it("renders the section heading", () => {
    render(<ElectionBasicsExplainer />);
    expect(screen.getByText(/Election Basics Explained/i)).toBeDefined();
  });

  it("renders the status safety note", () => {
    render(<ElectionBasicsExplainer />);
    expect(screen.getByText(/Explanations are grounded in official sources and simplified for clarity/i)).toBeDefined();
  });

  it("renders all six topic cards", () => {
    render(<ElectionBasicsExplainer />);
    ELECTION_BASICS_TOPICS.forEach((topic) => {
      expect(screen.getByText(topic.title)).toBeDefined();
      expect(screen.getByText(topic.shortDescription)).toBeDefined();
    });
  });

  it("renders status labels for all cards", () => {
    render(<ElectionBasicsExplainer />);
    const labels = screen.getAllByLabelText(/topic status:/i);
    expect(labels.length).toBe(ELECTION_BASICS_TOPICS.length);
  });

  it("shows detail panel when a topic is selected", () => {
    render(<ElectionBasicsExplainer />);
    const topic = ELECTION_BASICS_TOPICS[0];
    const card = screen.getByRole("button", { name: new RegExp(topic.title, "i") });
    fireEvent.click(card);

    expect(screen.getByRole("heading", { name: topic.title, level: 2 })).toBeDefined();
    expect(screen.getByText(/This topic explanation is grounded in official election sources/i)).toBeDefined();
    
    // Simpler check for the intro sentence
    expect(screen.getByText(/Learn about/i)).toBeDefined();
  });

  it("returns to topic grid when back button is clicked", () => {
    render(<ElectionBasicsExplainer />);
    const card = screen.getByText(ELECTION_BASICS_TOPICS[0].title);
    fireEvent.click(card);
    
    const backButton = screen.getByRole("button", { name: /back to topics/i });
    fireEvent.click(backButton);

    expect(screen.getByText(/Election Basics Explained/i)).toBeDefined();
  });
});
