import React, { useState } from "react";
import { GUIDED_JOURNEY_SUMMARIES, GuidedJourneySummary } from "@voteready/shared";
import { GuidedJourneyDetail } from "./GuidedJourneyDetail";

export const GuidedJourneyChooser: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<GuidedJourneySummary | null>(null);

  const handleSelect = (journey: GuidedJourneySummary) => {
    setSelectedJourney(journey);
  };

  const handleBack = () => {
    setSelectedJourney(null);
  };

  if (selectedJourney) {
    return <GuidedJourneyDetail journey={selectedJourney} onBack={handleBack} />;
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
