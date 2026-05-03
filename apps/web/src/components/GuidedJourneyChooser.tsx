import React, { useState } from "react";
import { GUIDED_JOURNEY_SUMMARIES, GuidedJourneySummary } from "@voteready/shared";
import { GuidedJourneyDetail } from "./GuidedJourneyDetail";
import { trackEvent } from "../lib/analytics";

export const GuidedJourneyChooser: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<GuidedJourneySummary | null>(null);

  const handleSelect = (journey: GuidedJourneySummary) => {
    setSelectedJourney(journey);
    trackEvent('guided_journey_selected', { journeyId: journey.id });
  };

  const handleBack = () => {
    setSelectedJourney(null);
    trackEvent('guided_journey_back_clicked');
  };

  if (selectedJourney) {
    return <GuidedJourneyDetail journey={selectedJourney} onBack={handleBack} />;
  }

  return (
    <section className="guided-journey-chooser" aria-labelledby="journey-chooser-title">
      <h2 id="journey-chooser-title">What applies to me?</h2>
      <p className="chooser-intro">
        Select a journey to understand how to prepare for the upcoming elections.
      </p>
      
      <div className="safety-note chooser-safety" role="note">
        These journey cards are navigation shells only. Verified source-backed journey guidance is not active yet.
      </div>

      <div className="journey-grid" role="list">
        {GUIDED_JOURNEY_SUMMARIES.map((journey) => (
          <div 
            key={journey.id} 
            className="journey-card" 
            onClick={() => handleSelect(journey)}
            id={`journey-card-${journey.id}`}
            role="listitem"
          >
            <button
              onClick={() => handleSelect(journey)}
              className="journey-card-button"
              aria-labelledby={`journey-title-${journey.id} journey-desc-${journey.id} journey-status-${journey.id}`}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'inherit', font: 'inherit', color: 'inherit', cursor: 'pointer', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 id={`journey-title-${journey.id}`}>{journey.title}</h3>
              <p id={`journey-desc-${journey.id}`}>{journey.shortDescription}</p>
              <span 
                id={`journey-status-${journey.id}`}
                className="status-label"
                aria-label={`Journey status: ${journey.status.replace(/_/g, " ")}`}
              >
                {journey.status.replace(/_/g, " ")}
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
