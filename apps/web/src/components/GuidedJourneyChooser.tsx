import React, { useState } from "react";
import { GUIDED_JOURNEY_SUMMARIES, GuidedJourneyId, GuidedJourneySummary } from "@voteready/shared";

export const GuidedJourneyChooser: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<GuidedJourneySummary | null>(null);

  const handleSelect = (journey: GuidedJourneySummary) => {
    setSelectedJourney(journey);
  };

  const handleBack = () => {
    setSelectedJourney(null);
  };

  if (selectedJourney) {
    return (
      <div className="guided-journey-details" id="guided-journey-placeholder">
        <button onClick={handleBack} className="back-button">← Back to Journeys</button>
        <h3>{selectedJourney.title}</h3>
        <div className="placeholder-panel">
          <p><strong>Status:</strong> {selectedJourney.status.replace(/_/g, " ")}</p>
          <div className="safety-note-box">
            <p className="safety-note">
              Verified source-backed journey guidance is not active yet.
            </p>
            <p className="safety-detail">
              This journey is not active yet. Future tasks will connect reviewed source content before showing step-by-step guidance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guided-journey-chooser">
      <h2>What applies to me?</h2>
      <p className="chooser-intro">
        Select a journey to understand how to prepare for the upcoming elections.
      </p>
      
      <div className="safety-note chooser-safety">
        These journey cards are navigation shells only. Verified source-backed journey guidance is not active yet.
      </div>

      <div className="journey-grid">
        {GUIDED_JOURNEY_SUMMARIES.map((journey) => (
          <div 
            key={journey.id} 
            className="journey-card" 
            onClick={() => handleSelect(journey)}
            id={`journey-card-${journey.id}`}
          >
            <h3>{journey.title}</h3>
            <p>{journey.shortDescription}</p>
            <span className="status-label">{journey.status.replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
