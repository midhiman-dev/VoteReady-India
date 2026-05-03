import { useState } from 'react';
import { 
  AssistantRequest, 
  AssistantResponse, 
  LanguagePreference, 
  ExplanationMode,
  SUPPORTED_LANGUAGES,
  SUPPORTED_EXPLANATION_MODES,
  SavedGuidanceItem,
} from '@voteready/shared';
import { postAssistantRequest } from '../lib/apiClient';
import AssistantResponsePreview from './AssistantResponsePreview';
import { saveGuidanceItem } from '../lib/savedGuidanceStorage';
import { trackEvent } from '../lib/analytics';

function formatOptionLabel(val: string): string {
  return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

interface AssistantShellProps {
  onItemSaved?: () => void;
}

const SUGGESTED_QUESTIONS = [
  'How do I register to vote?',
  'What happens on polling day?',
  'I am turning 18. What should I do?',
  'What is the voter ID card?',
];

export default function AssistantShell({ onItemSaved }: AssistantShellProps) {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<LanguagePreference>('simple_english');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('simple');
  
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!response) return;

    const item: SavedGuidanceItem = {
      id: response.id,
      question,
      responseStatus: response.status,
      language: response.language,
      explanationMode: response.explanationMode,
      savedTimestamp: new Date().toISOString(),
      shortSummary: response.answerBlocks.find(b => b.type === 'short_answer')?.content.substring(0, 100) + '...' || 'No summary available',
      sourceCount: response.sources.length,
      localOnlyMarker: true
    };

    saveGuidanceItem(item);
    setIsSaved(true);
    setSaveConfirmed(true);

    trackEvent('assistant_response_saved_locally', {
      language: response.language,
      explanationMode: response.explanationMode,
      responseStatus: response.status,
      sourceCount: response.sources.length,
      storageMode: 'local'
    });

    if (onItemSaved) onItemSaved();

    // Clear the confirmation banner after 3 seconds
    setTimeout(() => setSaveConfirmed(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsSaved(false);
    setSaveConfirmed(false);

    const request: AssistantRequest = {
      question,
      language,
      explanationMode
    };

    try {
      trackEvent('assistant_question_submitted', {
        language,
        explanationMode
      });

      const data = await postAssistantRequest(request);
      setResponse(data);

      trackEvent('assistant_response_received', {
        language: data.language,
        explanationMode: data.explanationMode,
        responseStatus: data.status,
        sourceCount: data.sources.length
      });
    } catch (err) {
      console.error('Error calling assistant API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setQuestion(chip);
  };

  const showEmptyState = !loading && !response && !error;

  return (
    <div className="card assistant-card">
      <h2>Ask VoteReady</h2>
      <div className="assistant-safety-note" role="note">
        <span className="safety-icon">🔗</span>
        <p>I'm connected, but I can't verify real election guidance yet. I'll let you know what I can and can't help with.</p>
      </div>

      <form onSubmit={handleSubmit} className="assistant-form">
        <div className="form-group">
          <label htmlFor="question" className="label">Ask a question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="What would you like to know about voting in India?"
            required
            aria-required="true"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language" className="label">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {formatOptionLabel(lang)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mode" className="label">Mode:</label>
            <select
              id="mode"
              value={explanationMode}
              onChange={(e) => setExplanationMode(e.target.value as ExplanationMode)}
            >
              {SUPPORTED_EXPLANATION_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {formatOptionLabel(mode)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !question.trim()} 
          className="submit-btn"
          aria-busy={loading}
        >
          {loading ? (
            <span className="btn-thinking">
              <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
              Thinking
            </span>
          ) : 'Ask Assistant'}
        </button>
      </form>

      {/* Empty / first-time state with suggested questions */}
      {showEmptyState && (
        <div className="assistant-empty-state">
          <p className="suggested-label">Try asking:</p>
          <div className="suggestion-chips" role="group" aria-label="Suggested questions">
            {SUGGESTED_QUESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="suggestion-chip"
                onClick={() => handleChipClick(chip)}
                aria-label={`Ask: ${chip}`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thinking state */}
      {loading && (
        <div className="assistant-thinking" role="status" aria-live="polite">
          <div className="thinking-indicator">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
          <p>Looking through available sources…</p>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        {error && (
          <div className="error mini-error" role="alert">
            <p><strong>Something went wrong:</strong> {error}</p>
            <p className="error-guidance">Please check your connection and try again.</p>
          </div>
        )}

        {response && (
          <div className="response-section response-fade-in">
            <div className="response-section-header">
              <h3>Response</h3>
              <div className="response-actions">
                {!isSaved ? (
                  <button 
                    onClick={handleSave} 
                    className="save-response-btn" 
                    aria-label="Save response locally"
                  >
                    🔖 Save
                  </button>
                ) : (
                  <span 
                    role="status"
                    className="saved-confirmation"
                  >
                    ✓ Saved locally
                  </span>
                )}
              </div>
            </div>

            {/* Save confirmation banner */}
            {saveConfirmed && (
              <div className="save-toast" role="status" aria-live="polite">
                <span>✓</span> Response saved to your device. View it in the Saved tab.
              </div>
            )}

            <AssistantResponsePreview response={response} question={question} />
          </div>
        )}
      </div>
    </div>
  );
}
