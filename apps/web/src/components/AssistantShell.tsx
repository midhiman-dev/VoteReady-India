import { useState, useMemo } from 'react';
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
import { saveGuidance } from '../lib/savedGuidanceRepository';
import { useAuth } from '../lib/AuthContext';
import { trackEvent } from '../lib/analytics';
import { detectIntent, IntentResult } from '../lib/intentDetector';

function formatOptionLabel(val: string): string {
  return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

interface AssistantShellProps {
  onItemSaved?: () => void;
}

const DEFAULT_CHIPS = [
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
  const [lastIntent, setLastIntent] = useState<IntentResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // ─── Live intent detection on every keystroke ───────────────────────────────
  const liveIntent = useMemo(() => detectIntent(question), [question]);
  const showInputHint = question.trim().length > 8 && liveIntent.hintLabel !== '';

  // ─── Chip logic ─────────────────────────────────────────────────────────────
  // After a response: show follow-ups from last intent
  // Before a response: show smart defaults rotated by detected intent
  const emptyStateChips = liveIntent.intent !== 'GENERIC_INTENT'
    ? liveIntent.followUpChips
    : DEFAULT_CHIPS;

  const handleSave = async () => {
    if (!response) return;

    const item: SavedGuidanceItem = {
      id: response.id,
      userId: user?.uid,
      question,
      responseStatus: response.status,
      language: response.language,
      explanationMode: response.explanationMode,
      savedTimestamp: new Date().toISOString(),
      shortSummary:
        response.answerBlocks.find(b => b.type === 'short_answer')?.content.substring(0, 100) +
          '...' || 'No summary available',
      sourceCount: response.sources.length,
      localOnlyMarker: !user,
      
      // Store rich details for Firestore/future local reconstruction
      answerBlocks: response.answerBlocks,
      sources: response.sources,
      freshnessSummary: response.freshnessSummary
    };

    await saveGuidance(item, user?.uid);
    setIsSaved(true);
    setSaveConfirmed(true);

    trackEvent('assistant_response_saved', {
      language: response.language,
      explanationMode: response.explanationMode,
      responseStatus: response.status,
      sourceCount: response.sources.length,
      storageMode: user ? 'cloud' : 'local',
    });

    if (onItemSaved) onItemSaved();
    setTimeout(() => setSaveConfirmed(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const detected = detectIntent(question);
    setLastIntent(detected);

    setLoading(true);
    setError(null);
    setResponse(null);
    setIsSaved(false);
    setSaveConfirmed(false);

    const request: AssistantRequest = { question, language, explanationMode };

    try {
      trackEvent('assistant_question_submitted', {
        language,
        explanationMode,
      });

      const data = await postAssistantRequest(request);
      setResponse(data);

      trackEvent('assistant_response_received', {
        language: data.language,
        explanationMode: data.explanationMode,
        responseStatus: data.status,
        sourceCount: data.sources.length,
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
        <p>
          I'm connected, but I can't verify real election guidance yet. I'll let you know what I
          can and can't help with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="assistant-form">
        <div className="form-group">
          <label htmlFor="question" className="label">
            Ask a question:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={3}
            placeholder="What would you like to know about voting in India?"
            required
            aria-required="true"
          />
          {/* Input awareness hint */}
          {showInputHint && (
            <p className="input-intent-hint" aria-live="polite" role="status">
              <span className="hint-icon">💬</span> {liveIntent.hintLabel}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language" className="label">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={e => setLanguage(e.target.value as LanguagePreference)}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {formatOptionLabel(lang)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mode" className="label">
              Mode:
            </label>
            <select
              id="mode"
              value={explanationMode}
              onChange={e => setExplanationMode(e.target.value as ExplanationMode)}
            >
              {SUPPORTED_EXPLANATION_MODES.map(mode => (
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
              <span className="thinking-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
              Thinking
            </span>
          ) : (
            'Ask Assistant'
          )}
        </button>
      </form>

      {/* Empty / first-time state with intent-aware chips */}
      {showEmptyState && (
        <div className="assistant-empty-state">
          <p className="suggested-label">Try asking:</p>
          <div className="suggestion-chips" role="group" aria-label="Suggested questions">
            {emptyStateChips.map(chip => (
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
            <p>
              <strong>Something went wrong:</strong> {error}
            </p>
            <p className="error-guidance">Please check your connection and try again.</p>
          </div>
        )}

        {response && lastIntent && (
          <div className="response-section response-fade-in">
            <div className="response-section-header">
              <h3>Response</h3>
              <div className="response-actions">
                {!isSaved ? (
                  <button
                    onClick={handleSave}
                    className="save-response-btn"
                    aria-label={user ? "Save response to your account" : "Save response locally"}
                  >
                    🔖 {user ? 'Save to Cloud' : 'Save'}
                  </button>
                ) : (
                  <span role="status" className="saved-confirmation">
                    ✓ Saved locally
                  </span>
                )}
              </div>
            </div>

            {/* Save confirmation toast */}
            {saveConfirmed && (
              <div className="save-toast" role="status" aria-live="polite">
                <span>✓</span> Response saved to your device. View it in the Saved tab.
              </div>
            )}

            <AssistantResponsePreview
              response={response}
              question={question}
              intent={lastIntent}
            />

            {/* Follow-up suggestions */}
            {lastIntent.followUpChips.length > 0 && (
              <div className="followup-section" aria-label="Follow-up suggestions">
                <p className="followup-label">You might also want to ask:</p>
                <div className="suggestion-chips followup-chips" role="group" aria-label="Follow-up questions">
                  {lastIntent.followUpChips.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      className="suggestion-chip followup-chip"
                      onClick={() => handleChipClick(chip)}
                      aria-label={`Ask: ${chip}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <p className="continuity-hint">
                  You can ask a follow-up or explore another topic.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
