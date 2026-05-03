import { AssistantResponse } from '@voteready/shared';
import { IntentResult } from '../lib/intentDetector';

interface Props {
  response: AssistantResponse;
  question?: string;
  intent?: IntentResult;
}

const FRESHNESS_LABEL: Record<string, { icon: string; label: string; className: string }> = {
  verified:   { icon: '✓',  label: 'Verified',   className: 'freshness-verified' },
  review_due: { icon: '⚠️', label: 'Review due', className: 'freshness-review_due' },
  stale:      { icon: '❌', label: 'Stale',       className: 'freshness-stale' },
  archived:   { icon: '📦', label: 'Archived',    className: 'freshness-archived' },
  unverified: { icon: '❓', label: 'Unverified',  className: 'freshness-unverified' },
};

function getFreshness(status: string) {
  return FRESHNESS_LABEL[status] ?? { icon: '❓', label: status, className: '' };
}

function formatLanguage(lang: string) {
  return lang.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatMode(mode: string) {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return ts;
  }
}

/**
 * Renders answer blocks grouped by semantic role.
 * Intent-aware context framing overrides the generic "what_this_means" block when available.
 */
function AnswerBlocks({
  response,
  intent,
}: {
  response: AssistantResponse;
  intent?: IntentResult;
}) {
  const { answerBlocks, explanationMode, status } = response;

  const shortAnswer   = answerBlocks.find(b => b.type === 'short_answer');
  const contextBlock  = answerBlocks.find(b => b.type === 'what_this_means');
  const nextSteps     = answerBlocks.find(b => b.type === 'next_steps');
  const refusal       = answerBlocks.find(b => b.type === 'neutral_refusal');
  const sourceNote    = answerBlocks.find(b => b.type === 'source_note');

  const isCannotVerify  = status === 'cannot_verify';
  const isOutOfScope    = status === 'out_of_scope';
  const isNonVerifiable = isCannotVerify || isOutOfScope || !!refusal;

  // Intent-aware framing: override generic context with situational copy
  const intentContextText =
    intent && intent.intent !== 'GENERIC_INTENT' && intent.contextFraming
      ? intent.contextFraming
      : null;

  // Use intent framing if available, otherwise fall back to backend block
  const contextText = intentContextText ?? contextBlock?.content ?? null;
  const contextHeading = contextBlock?.heading ?? 'What this means for you';

  return (
    <div className="answer-sections">
      {/* 1. Direct Answer */}
      {shortAnswer && (
        <div
          className={`answer-section answer-section--direct${intent && intent.intent !== 'GENERIC_INTENT' ? ' answer-section--intent-highlighted' : ''}`}
          role="region"
          aria-label="Direct answer"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">💡</span>
            Answer
          </div>
          <p className="answer-section-content answer-direct-text">{shortAnswer.content}</p>
        </div>
      )}

      {/* Cannot-verify / out-of-scope / refusal — friendly state */}
      {isNonVerifiable && (
        <div
          className="answer-section answer-section--cannot-verify"
          role="region"
          aria-label="Verification status"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">🔍</span>
            Verification Status
          </div>
          {refusal ? (
            <p className="answer-section-content">{refusal.content}</p>
          ) : isCannotVerify ? (
            <div className="cannot-verify-message">
              <p>I haven't been able to verify this against an official source yet.</p>
              <p className="cannot-verify-guidance">
                For accurate guidance, please check the official ECI website or Voters' Services
                Portal directly.
              </p>
            </div>
          ) : (
            <p className="answer-section-content">
              This question falls outside what I'm set up to answer safely right now.
            </p>
          )}
        </div>
      )}

      {/* 2. What this means — intent-aware, shown in simple + detailed */}
      {contextText && (explanationMode === 'simple' || explanationMode === 'detailed') && (
        <div
          className="answer-section answer-section--context"
          role="region"
          aria-label="What this means"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">🎯</span>
            {contextHeading}
          </div>
          <p className="answer-section-content">{contextText}</p>
          {/* Badge when using intent override */}
          {intentContextText && (
            <span className="intent-context-badge" aria-label="Personalised context">
              Tailored to your question
            </span>
          )}
        </div>
      )}

      {/* 3. Next steps — only in detailed, with structured preamble */}
      {nextSteps && explanationMode === 'detailed' && (
        <div
          className="answer-section answer-section--next-steps"
          role="region"
          aria-label="Next steps"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">👣</span>
            {nextSteps.heading || 'Next Steps'}
          </div>
          <div className="next-steps-structure">
            <div className="next-step-row">
              <span className="next-step-num">1</span>
              <span>Understand what this question is about</span>
            </div>
            <div className="next-step-row">
              <span className="next-step-num">2</span>
              <span>Verify details on the official source below</span>
            </div>
            <div className="next-step-row">
              <span className="next-step-num">3</span>
              <span>Once verified sources are connected, I'll guide you step-by-step</span>
            </div>
          </div>
          <p className="answer-section-content next-steps-detail">{nextSteps.content}</p>
          <p className="next-steps-caution">
            Always verify steps on the official ECI or Voters' Services Portal before acting.
          </p>
        </div>
      )}

      {/* Source note */}
      {sourceNote && (
        <div
          className="answer-section answer-section--source-note"
          role="region"
          aria-label="Source note"
        >
          <p className="answer-section-content answer-source-note-text">{sourceNote.content}</p>
        </div>
      )}

      {/* Fallback: other blocks not caught above */}
      {answerBlocks
        .filter(
          b =>
            !['short_answer', 'what_this_means', 'next_steps', 'neutral_refusal', 'source_note'].includes(
              b.type
            )
        )
        .map((block, i) => (
          <div
            key={i}
            className={`answer-section answer-section--other block-${block.type}`}
            role="region"
            aria-label={block.heading || block.type.replace(/_/g, ' ')}
          >
            {block.heading && <div className="answer-section-label">{block.heading}</div>}
            <p className="answer-section-content">{block.content}</p>
          </div>
        ))}
    </div>
  );
}

export default function AssistantResponsePreview({ response, question, intent }: Props) {
  const freshness = response.freshnessSummary
    ? getFreshness(response.freshnessSummary.status)
    : null;

  return (
    <div className="response-preview">
      {/* Response metadata row */}
      <div className="response-meta-bar" aria-label="Response metadata">
        <div className="response-meta-pills">
          <span
            className={`status-badge status-${response.status}`}
            aria-label={`Response status: ${response.status.replace(/_/g, ' ')}`}
          >
            {response.status.replace(/_/g, ' ')}
          </span>
          <span className="meta-pill meta-language" title="Language">
            🌐 {formatLanguage(response.language)}
          </span>
          <span className="meta-pill meta-mode" title="Explanation mode">
            ⚙ {formatMode(response.explanationMode)}
          </span>
          {/* Show intent badge when a strong intent was detected */}
          {intent && intent.intent !== 'GENERIC_INTENT' && (
            <span className="meta-pill meta-intent" title="Detected topic">
              🎓 {intent.intent.replace('_INTENT', '').toLowerCase()}
            </span>
          )}
        </div>
        <span className="response-timestamp" aria-label={`Response ID: ${response.id}`}>
          <time dateTime={response.generatedAt}>{formatTimestamp(response.generatedAt)}</time>
        </span>
      </div>

      {/* Question echo */}
      {question && question.trim() && (
        <div className="response-question-echo" aria-label="Your question">
          <span className="question-echo-icon">❓</span>
          <span className="question-echo-text">{question}</span>
        </div>
      )}

      {/* Structured answer blocks with intent context */}
      <AnswerBlocks response={response} intent={intent} />

      {/* Disclaimer */}
      {response.disclaimer && (
        <p className="response-disclaimer" role="note">
          {response.disclaimer}
        </p>
      )}

      {/* Sources & Verification section */}
      {(response.sources.length > 0 || response.freshnessSummary) && (
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
                const sf = getFreshness(source.freshnessStatus);
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
                      <span
                        className={`source-freshness-badge ${sf.className}`}
                        aria-label={`Source freshness: ${sf.icon} ${sf.label}`}
                      >
                        {sf.icon} {sf.label}
                      </span>
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
      )}
    </div>
  );
}
