import React, { useState } from "react";
import { ELECTION_BASICS_TOPICS, ElectionBasicsTopicSummary } from "@voteready/shared";
import { trackEvent } from "../lib/analytics";

const formatStatus = (status: string) => {
  const normalized = status.replace(/_/g, ' ');
  if (status === 'coming_soon' || status === 'pending') return `⏳ ${normalized}`;
  if (status === 'active') return `✓ ${normalized}`;
  return `⏳ ${normalized}`;
};

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
          <p><strong>Status:</strong> Active. This topic explanation is grounded in official election sources and simplified by Gemini.</p>
        </div>

        <div className="placeholder-content" role="region" aria-label="Topic details">
          <p>Learn about <strong>{selectedTopic.title}</strong> through our simplified, source-backed explanations.</p>
          <p>
            We use the latest official data from the Election Commission of India to help you understand {selectedTopic.title.toLowerCase()}.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="election-basics-explainer" aria-labelledby="basics-explainer-title">
      <h2 id="basics-explainer-title">Election Basics Explained</h2>
      
      <div className="safety-note explainer-safety" role="note">
        <p><strong>Status:</strong> Active. Explanations are grounded in official sources and simplified for clarity.</p>
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
                {formatStatus(topic.status)}
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
