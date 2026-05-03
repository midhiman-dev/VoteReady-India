import { AssistantResponse } from '@voteready/shared';

interface Props {
  response: AssistantResponse;
  question?: string;
}

const FRESHNESS_LABEL: Record<string, { icon: string; label: string; className: string }> = {
  verified:    { icon: '✓',  label: 'Verified',    className: 'freshness-verified' },
  review_due:  { icon: '⚠️', label: 'Review due',  className: 'freshness-review_due' },
  stale:       { icon: '❌', label: 'Stale',        className: 'freshness-stale' },
  archived:    { icon: '📦', label: 'Archived',     className: 'freshness-archived' },
  unverified:  { icon: '❓', label: 'Unverified',   className: 'freshness-unverified' },
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
 * Blocks are ordered: short_answer → explanation → what_this_means / next_steps → source_note / neutral_refusal
 */
function AnswerBlocks({ response }: { response: AssistantResponse }) {
  const { answerBlocks, explanationMode, status } = response;

  const shortAnswer = answerBlocks.find(b => b.type === 'short_answer');
  const contextBlock = answerBlocks.find(b => b.type === 'what_this_means');
  const nextSteps = answerBlocks.find(b => b.type === 'next_steps');
  const refusal = answerBlocks.find(b => b.type === 'neutral_refusal');
  const sourceNote = answerBlocks.find(b => b.type === 'source_note');

  const isCannotVerify = status === 'cannot_verify';
  const isOutOfScope = status === 'out_of_scope';
  const isNonVerifiable = isCannotVerify || isOutOfScope || !!refusal;

  return (
    <div className="answer-sections">
      {/* 1. Direct Answer */}
      {shortAnswer && (
        <div className="answer-section answer-section--direct" role="region" aria-label="Direct answer">
          <div className="answer-section-label">
            <span className="answer-section-icon">💡</span>
            Answer
          </div>
          <p className="answer-section-content answer-direct-text">{shortAnswer.content}</p>
        </div>
      )}

      {/* Cannot-verify / out-of-scope / refusal — friendly state */}
      {isNonVerifiable && (
        <div className="answer-section answer-section--cannot-verify" role="region" aria-label="Verification status">
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
                For accurate guidance, please check the official ECI website or Voters' Services Portal directly.
              </p>
            </div>
          ) : (
            <p className="answer-section-content">This question falls outside what I'm set up to answer safely right now.</p>
          )}
        </div>
      )}

      {/* 2. What this means — only in 'simple' and 'detailed' modes */}
      {contextBlock && (explanationMode === 'simple' || explanationMode === 'detailed') && (
        <div className="answer-section answer-section--context" role="region" aria-label="What this means">
          <div className="answer-section-label">
            <span className="answer-section-icon">🎯</span>
            {contextBlock.heading || 'What this means for you'}
          </div>
          <p className="answer-section-content">{contextBlock.content}</p>
        </div>
      )}

      {/* 3. Next steps — only in 'detailed' mode */}
      {nextSteps && explanationMode === 'detailed' && (
        <div className="answer-section answer-section--next-steps" role="region" aria-label="Next steps">
          <div className="answer-section-label">
            <span className="answer-section-icon">👣</span>
            {nextSteps.heading || 'Next Steps'}
          </div>
          <p className="answer-section-content">{nextSteps.content}</p>
          <p className="next-steps-caution">
            Always verify steps on the official ECI or Voters' Services Portal before acting.
          </p>
        </div>
      )}

      {/* Source note */}
      {sourceNote && (
        <div className="answer-section answer-section--source-note" role="region" aria-label="Source note">
          <p className="answer-section-content answer-source-note-text">{sourceNote.content}</p>
        </div>
      )}

      {/* Fallback: other blocks */}
      {answerBlocks
        .filter(b => !['short_answer', 'what_this_means', 'next_steps', 'neutral_refusal', 'source_note'].includes(b.type))
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
        ))
      }
    </div>
  );
}

export default function AssistantResponsePreview({ response, question }: Props) {
  const freshness = response.freshnessSummary ? getFreshness(response.freshnessSummary.status) : null;

  return (
    <div className="response-preview">
      {/* Response metadata row */}
      <div className="response-meta-bar" aria-label="Response metadata">
        <div className="response-meta-pills">
          <span className={`status-badge status-${response.status}`} aria-label={`Response status: ${response.status.replace(/_/g, ' ')}`}>
            {response.status.replace(/_/g, ' ')}
          </span>
          <span className="meta-pill meta-language" title="Language">
            🌐 {formatLanguage(response.language)}
          </span>
          <span className="meta-pill meta-mode" title="Explanation mode">
            ⚙ {formatMode(response.explanationMode)}
          </span>
        </div>
        <span className="response-timestamp" aria-label={`Response ID: ${response.id}`}>
          <time dateTime={response.generatedAt}>{formatTimestamp(response.generatedAt)}</time>
        </span>
      </div>

      {/* Question echo (if provided) */}
      {question && question.trim() && (
        <div className="response-question-echo" aria-label="Your question">
          <span className="question-echo-icon">❓</span>
          <span className="question-echo-text">{question}</span>
        </div>
      )}

      {/* Structured answer blocks */}
      <AnswerBlocks response={response} />

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
              {response.sources.map((source) => {
                const sf = getFreshness(source.freshnessStatus);
                const isWarning = ['review_due', 'stale', 'unverified'].includes(source.freshnessStatus);
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
                        <span className="detail-label">Type:</span> {source.sourceType.replace(/_/g, ' ')}
                      </div>
                      <div className="source-detail">
                        <span className="detail-label">Jurisdiction:</span> {source.jurisdictionLevel}
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
            <p className="no-sources-note">
              No source records linked to this response yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
