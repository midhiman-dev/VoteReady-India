import React from 'react';
import { AssistantResponse } from '@voteready/shared';
import { IntentResult } from '../lib/intentDetector';
import { formatSnakeCase, formatCapitalize, formatTimestamp } from '../lib/formatters';

interface ResponseMetaBarProps {
  response: AssistantResponse;
  intent?: IntentResult;
}

export default function ResponseMetaBar({ response, intent }: ResponseMetaBarProps) {
  return (
    <div className="response-meta-bar" aria-label="Response metadata">
      <div className="response-meta-pills">
        <span
          className={`status-badge status-${response.status}`}
          aria-label={`Response status: ${response.status.replace(/_/g, ' ')}`}
        >
          {response.status.replace(/_/g, ' ')}
        </span>
        <span className="meta-pill meta-language" title="Language">
          🌐 {formatSnakeCase(response.language)}
        </span>
        <span className="meta-pill meta-mode" title="Explanation mode">
          ⚙ {formatCapitalize(response.explanationMode)}
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
  );
}
