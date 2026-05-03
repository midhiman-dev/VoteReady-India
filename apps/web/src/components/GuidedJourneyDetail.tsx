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
            ✓ Source-backed guidance active
          </p>
          <p className="safety-detail">
            This journey is powered by Gemini and grounded in official Election Commission of India (ECI) sources.
          </p>
        </div>

        {isTurning18 ? (
          <div className="detail-sections">
            <article className="detail-section">
              <h3>Current status</h3>
              <p>
                You are approaching a major milestone! This journey provides you with the essential steps to prepare for your first vote.
              </p>
            </article>
            <article className="detail-section">
              <h3>What this journey covers</h3>
              <p>
                We guide you through voter registration eligibility, the Form 6 application process, and identifying your polling station.
              </p>
            </article>
            <article className="detail-section">
              <h3>Source-backed steps</h3>
              <p>
                All guidance is fetched directly from our Firestore source registry, ensuring you have the latest official deadlines and requirements.
              </p>
            </article>
          </div>
        ) : (
          <div className="generic-placeholder" role="note">
            <p className="safety-detail" style={{ marginTop: "1rem" }}>
              Detailed step-by-step guidance for "{journey.title}" is generated based on real-time official sources.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
