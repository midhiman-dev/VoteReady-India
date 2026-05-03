import React from 'react';
import { AssistantResponse } from '@voteready/shared';
import { IntentResult } from '../lib/intentDetector';
import FreshnessBadge, { getFreshness } from './FreshnessBadge';

interface SourceVerificationSectionProps {
  response: AssistantResponse;
  intent?: IntentResult;
}

export default function SourceVerificationSection({ response, intent }: SourceVerificationSectionProps) {
  if (response.sources.length === 0 && !response.freshnessSummary) {
    return null;
  }

  const freshness = response.freshnessSummary
    ? getFreshness(response.freshnessSummary.status)
    : null;

  return (
    <section className="source-verification-section" aria-labelledby="src-section-title">
      <h4 id="src-section-title" className="source-section-title">
        <span>🔎</span> Sources &amp; Verification
      </h4>

      {/* Intent-based source framing */}
      {intent && intent.sourceFraming && (
        <p className="source-intent-framing">{intent.sourceFraming}</p>
      )}

      {/* Freshness summary banner */}
      {freshness && response.freshnessSummary && (
        <div
          className={`freshness-banner freshness-${response.freshnessSummary.status}`}
          role="status"
        >
          <span className="freshness-icon">{freshness.icon}</span>
          <div className="freshness-text">
            <strong>{freshness.label}</strong>
            <span> — {response.freshnessSummary.message}</span>
          </div>
        </div>
      )}

      {/* Source cards */}
      {response.sources.length > 0 && (
        <div className="source-cards-list">
          {response.sources.map(source => {
            const isWarning = ['review_due', 'stale', 'unverified'].includes(
              source.freshnessStatus
            );
            return (
              <article
                key={source.id}
                className={`assistant-source-card ${isWarning ? 'source-card--warning' : ''}`}
              >
                <div className="source-card-header">
                  <span className="source-card-title">{source.title}</span>
                  <FreshnessBadge status={source.freshnessStatus} />
                </div>
                <div className="source-card-body">
                  <div className="source-detail">
                    <span className="detail-label">Type:</span>{' '}
                    {source.sourceType.replace(/_/g, ' ')}
                  </div>
                  <div className="source-detail">
                    <span className="detail-label">Jurisdiction:</span>{' '}
                    {source.jurisdictionLevel}
                  </div>
                  {source.publisher && (
                    <div className="source-detail">
                      <span className="detail-label">Publisher:</span> {source.publisher}
                    </div>
                  )}
                </div>
                <div
                  className="source-card-safety-note"
                  role="note"
                  aria-label="Source safety note"
                >
                  Metadata only — not verified procedural guidance yet.
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* No sources fallback */}
      {response.sources.length === 0 && (
        <p className="no-sources-note">No source records linked to this response yet.</p>
      )}
    </section>
  );
}
