import React from "react";
import { GuidedJourneySummary } from "@voteready/shared";

interface GuidedJourneyDetailProps {
  journey: GuidedJourneySummary;
  onBack: () => void;
}

export const GuidedJourneyDetail: React.FC<GuidedJourneyDetailProps> = ({ journey, onBack }) => {
  const isTurning18 = journey.id === "turning_18_soon";

  return (
    <section className="guided-journey-details" id={`journey-detail-${journey.id}`} aria-labelledby={`journey-detail-title-${journey.id}`}>
      <button 
        onClick={onBack} 
        className="back-button"
        aria-label="Back to Journeys"
      >
        ← Back to Journeys
      </button>
      <h2 id={`journey-detail-title-${journey.id}`}>{journey.title}</h2>
      
      <div className="placeholder-panel" role="region" aria-label="Journey details">
        <p><strong>Status:</strong> {journey.status.replace(/_/g, " ")}</p>
        
        <div className="safety-note-box" role="note">
          <p className="safety-note">
            Source-backed guidance pending
          </p>
          <p className="safety-detail">
            This journey is not active yet. Reviewed source content must be connected before step-by-step guidance is shown.
          </p>
        </div>

        {isTurning18 ? (
          <div className="detail-sections">
            <article className="detail-section">
              <h3>Current status</h3>
              <p>
                This Turning 18 soon journey is a placeholder shell. Future tasks will connect reviewed official source content before showing step-by-step guidance.
              </p>
            </article>
            <article className="detail-section">
              <h3>What this journey will help with</h3>
              <p>
                When active, this journey will provide a guided path for individuals approaching voting age to understand preparation steps.
              </p>
            </article>
            <article className="detail-section">
              <h3>Source-backed steps pending</h3>
              <p>
                No current registration, requirements, or procedural guidance is active in this shell. Verified official sources will be used to generate steps in a future update.
              </p>
            </article>
            <article className="detail-section">
              <h3>What comes next</h3>
              <p>
                Once source content is connected, you will be able to follow a structured timeline to prepare for your first election.
              </p>
            </article>
          </div>
        ) : (
          <div className="generic-placeholder" role="note">
            <p className="safety-detail" style={{ marginTop: "1rem" }}>
              Future tasks will connect reviewed source content for the "{journey.title}" journey.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
