import { AssistantResponse } from '@voteready/shared';

interface Props {
  response: AssistantResponse;
}

export default function AssistantResponsePreview({ response }: Props) {
  return (
    <div className="response-preview">
      <div className="response-header">
        <span className={`status-badge status-${response.status}`}>
          {response.status.replace(/_/g, ' ')}
        </span>
        <span className="response-id">ID: {response.id}</span>
      </div>

      <div className="response-meta-info">
        <div><span className="label">Language:</span> {response.language}</div>
        <div><span className="label">Mode:</span> {response.explanationMode}</div>
        <div><span className="label">Generated:</span> {new Date(response.generatedAt).toLocaleString()}</div>
      </div>

      <div className="answer-blocks">
        {response.answerBlocks.map((block, index) => (
          <div key={index} className={`answer-block block-${block.type}`}>
            {block.heading && <h4>{block.heading}</h4>}
            <p>{block.content}</p>
          </div>
        ))}
      </div>

      {response.freshnessSummary && (
        <div className={`freshness-summary freshness-${response.freshnessSummary.status}`}>
          <span className="label">Freshness:</span> {response.freshnessSummary.message}
        </div>
      )}

      {response.disclaimer && (
        <div className="disclaimer-note">
          {response.disclaimer}
        </div>
      )}

      <div className="source-count">
        Sources returned: {response.sources.length}
      </div>
    </div>
  );
}
