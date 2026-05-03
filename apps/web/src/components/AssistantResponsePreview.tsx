import { AssistantResponse } from '@voteready/shared';

interface Props {
  response: AssistantResponse;
}

const formatFreshness = (status: string) => {
  const labels: Record<string, string> = {
    verified: 'Verified',
    review_due: 'Review due',
    stale: 'Stale',
    archived: 'Archived',
    unverified: 'Unverified'
  };
  return labels[status] || status;
};

export default function AssistantResponsePreview({ response }: Props) {
  return (
    <div className="response-preview">
      <div className="response-header">
        <span 
          className={`status-badge status-${response.status}`}
          aria-label={`Response status: ${response.status.replace(/_/g, ' ')}`}
        >
          {response.status.replace(/_/g, ' ')}
        </span>
        <span className="response-id" aria-label={`Response ID: ${response.id}`}>ID: {response.id}</span>
      </div>

      <div className="response-meta-info">
        <div><span className="label">Language:</span> {response.language.replace(/_/g, ' ')}</div>
        <div><span className="label">Mode:</span> {response.explanationMode}</div>
        <div>
          <span className="label">Generated:</span>{' '}
          <time dateTime={response.generatedAt}>
            {new Date(response.generatedAt).toLocaleString()}
          </time>
        </div>
      </div>

      <div className="answer-blocks">
        {response.answerBlocks.map((block, index) => (
          <div 
            key={index} 
            className={`answer-block block-${block.type}`}
            role="region" 
            aria-label={block.heading || `${block.type.replace(/_/g, ' ')} content`}
          >
            {block.heading && <h4>{block.heading}</h4>}
            <p>{block.content}</p>
          </div>
        ))}
      </div>

      {response.freshnessSummary && (
        <div 
          className={`freshness-summary freshness-${response.freshnessSummary.status}`}
          role="status"
        >
          <span className="label">Freshness:</span> {response.freshnessSummary.message}
        </div>
      )}

      {response.disclaimer && (
        <div className="disclaimer-note" role="note">
          {response.disclaimer}
        </div>
      )}

      <div className="source-count" aria-live="polite">
        Sources returned: {response.sources.length}
      </div>

      {response.sources.length > 0 && (
        <section className="source-cards-section" aria-labelledby="source-section-title">
          <h4 id="source-section-title" className="source-section-title">Source Metadata</h4>
          <div className="source-cards-list">
            {response.sources.map((source) => (
              <article key={source.id} className="assistant-source-card">
                <div className="source-card-header">
                  <span className="source-card-title">{source.title}</span>
                  <span 
                    className={`source-freshness-badge freshness-${source.freshnessStatus}`}
                    aria-label={`Source freshness: ${formatFreshness(source.freshnessStatus)}`}
                  >
                    {formatFreshness(source.freshnessStatus)}
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
                  Source metadata only. These records are not verified procedural guidance yet.
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
