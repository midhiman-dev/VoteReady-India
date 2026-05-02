import React, { useState } from "react";
import { ELECTION_BASICS_TOPICS, ElectionBasicsTopicSummary } from "@voteready/shared";

/**
 * Election Basics Explainer Shell Component
 * Provides a safe placeholder for civic education topics.
 */
export const ElectionBasicsExplainer: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<ElectionBasicsTopicSummary | null>(null);

  const handleSelect = (topic: ElectionBasicsTopicSummary) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  if (selectedTopic) {
    return (
      <div className="election-basics-detail" id="election-basics-detail">
        <button onClick={handleBack} className="back-button" aria-label="Back to topics">
          ← Back to Topics
        </button>
        <h2>{selectedTopic.title}</h2>
        
        <div className="safety-note detail-safety">
          <p><strong>Source-pending:</strong> Election basics explainers are not active yet. Reviewed official source content must be connected before explanations are shown.</p>
        </div>

        <div className="placeholder-content">
          <p>This is a placeholder detail panel for <strong>{selectedTopic.title}</strong>.</p>
          <p>
            This topic will explain the concept once reviewed official source content is connected.
            Source-backed explanation pending.
          </p>
          <p className="internal-note">
            <em>Note: This is a placeholder explainer shell for future civic education content.</em>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="election-basics-explainer">
      <h2>Election Basics Explained</h2>
      
      <div className="safety-note explainer-safety">
        <p><strong>Status:</strong> Election basics explainers are not active yet. Reviewed official source content must be connected before explanations are shown.</p>
      </div>
      
      <div className="topic-grid">
        {ELECTION_BASICS_TOPICS.map((topic) => (
          <div 
            key={topic.id} 
            className="topic-card" 
            onClick={() => handleSelect(topic)}
            id={`topic-card-${topic.id}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSelect(topic);
              }
            }}
          >
            <h3>{topic.title}</h3>
            <p>{topic.shortDescription}</p>
            <span className="status-label">{topic.status.replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
