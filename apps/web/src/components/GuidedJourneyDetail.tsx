import React from "react";
import { GuidedJourneySummary } from "@voteready/shared";

interface GuidedJourneyDetailProps {
  journey: GuidedJourneySummary;
  onBack: () => void;
}

export const GuidedJourneyDetail: React.FC<GuidedJourneyDetailProps> = ({ journey, onBack }) => {
  const isTurning18 = journey.id === "turning_18_soon";

  return (
    <div className="guided-journey-details" id={`journey-detail-${journey.id}`}>
      <button onClick={onBack} className="back-button">← Back to Journeys</button>
      <h3>{journey.title}</h3>
      
      <div className="placeholder-panel">
        <p><strong>Status:</strong> {journey.status.replace(/_/g, " ")}</p>
        
        <div className="safety-note-box">
          <p className="safety-note">
            Source-backed guidance pending
          </p>
          <p className="safety-detail">
            This journey is not active yet. Reviewed source content must be connected before step-by-step guidance is shown.
          </p>
        </div>

        {isTurning18 ? (
          <div className="detail-sections">
            <div className="detail-section">
              <h4>Current status</h4>
              <p>
                This Turning 18 soon journey is a placeholder shell. Future tasks will connect reviewed official source content before showing step-by-step guidance.
              </p>
            </div>
            <div className="detail-section">
              <h4>What this journey will help with</h4>
              <p>
                When active, this journey will provide a guided path for individuals approaching voting age to understand preparation steps.
              </p>
            </div>
            <div className="detail-section">
              <h4>Source-backed steps pending</h4>
              <p>
                No current registration, requirements, or procedural guidance is active in this shell. Verified official sources will be used to generate steps in a future update.
              </p>
            </div>
            <div className="detail-section">
              <h4>What comes next</h4>
              <p>
                Once source content is connected, you will be able to follow a structured timeline to prepare for your first election.
              </p>
            </div>
          </div>
        ) : (
          <div className="generic-placeholder">
            <p className="safety-detail" style={{ marginTop: "1rem" }}>
              Future tasks will connect reviewed source content for the "{journey.title}" journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
