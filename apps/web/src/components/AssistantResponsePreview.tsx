import { useEffect } from 'react';
import { AssistantResponse } from '@voteready/shared';
import { IntentResult } from '../lib/intentDetector';
import { trackEvent } from '../lib/analytics';
import ResponseMetaBar from './ResponseMetaBar';
import AnswerBlocks from './AnswerBlocks';
import SourceVerificationSection from './SourceVerificationSection';

interface Props {
  response: AssistantResponse;
  question?: string;
  intent?: IntentResult;
}

export default function AssistantResponsePreview({ response, question, intent }: Props) {
  useEffect(() => {
    if (response.sources.length > 0) {
      // Track one event for the view, with metadata about types
      const sourceTypes = Array.from(new Set(response.sources.map(s => s.sourceType))).join(',');
      const freshnessStates = Array.from(new Set(response.sources.map(s => s.freshnessStatus))).join(',');
      
      trackEvent('source_card_viewed', {
        sourceCount: response.sources.length,
        sourceType: sourceTypes,
        freshnessState: freshnessStates,
        responseStatus: response.status
      });
    }
  }, [response.id]);

  return (
    <div className="response-preview">
      {/* Response metadata row */}
      <ResponseMetaBar response={response} intent={intent} />

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
      <SourceVerificationSection response={response} intent={intent} />
    </div>
  );
}
