import React, { useState } from "react";
import { ELECTION_BASICS_TOPICS, ElectionBasicsTopicSummary } from "@voteready/shared";
import { trackEvent } from "../lib/analytics";

/**
 * Election Basics Explainer Shell Component
 * Provides a safe placeholder for civic education topics.
 */
export const ElectionBasicsExplainer: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<ElectionBasicsTopicSummary | null>(null);

  const handleSelect = (topic: ElectionBasicsTopicSummary) => {
    setSelectedTopic(topic);
    trackEvent('election_basics_topic_selected', { topicId: topic.id });
  };

  const handleBack = () => {
    setSelectedTopic(null);
    trackEvent('election_basics_back_clicked');
  };

  if (selectedTopic) {
    return (
      <section className="election-basics-detail" id="election-basics-detail" aria-labelledby={`basics-detail-title-${selectedTopic.id}`}>
        <button 
          onClick={handleBack} 
          className="back-button" 
          aria-label="Back to topics"
        >
          ← Back to Topics
        </button>
        <h2 id={`basics-detail-title-${selectedTopic.id}`}>{selectedTopic.title}</h2>
        
        <div className="safety-note detail-safety" role="note">
          <p><strong>Source-pending:</strong> Election basics explainers are not active yet. Reviewed official source content must be connected before explanations are shown.</p>
        </div>

        <div className="placeholder-content" role="region" aria-label="Topic details">
          <p>This is a placeholder detail panel for <strong>{selectedTopic.title}</strong>.</p>
          <p>
            This topic will explain the concept once reviewed official source content is connected.
            Source-backed explanation pending.
          </p>
          <p className="internal-note" role="note">
            <em>Note: This is a placeholder explainer shell for future civic education content.</em>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="election-basics-explainer" aria-labelledby="basics-explainer-title">
      <h2 id="basics-explainer-title">Election Basics Explained</h2>
      
      <div className="safety-note explainer-safety" role="note">
        <p><strong>Status:</strong> Election basics explainers are not active yet. Reviewed official source content must be connected before explanations are shown.</p>
      </div>
      
      <div className="topic-grid" role="list">
        {ELECTION_BASICS_TOPICS.map((topic) => (
          <div 
            key={topic.id} 
            className="topic-card" 
            onClick={() => handleSelect(topic)}
            id={`topic-card-${topic.id}`}
            role="listitem"
          >
            <button
              onClick={() => handleSelect(topic)}
              className="topic-card-button"
              aria-labelledby={`topic-title-${topic.id} topic-desc-${topic.id} topic-status-${topic.id}`}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'inherit', font: 'inherit', color: 'inherit', cursor: 'pointer', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 id={`topic-title-${topic.id}`}>{topic.title}</h3>
              <p id={`topic-desc-${topic.id}`}>{topic.shortDescription}</p>
              <span 
                id={`topic-status-${topic.id}`}
                className="status-label"
                aria-label={`Topic status: ${topic.status.replace(/_/g, " ")}`}
              >
                {topic.status.replace(/_/g, " ")}
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
