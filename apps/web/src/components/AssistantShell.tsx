import { useState, useMemo } from 'react';
import { 
  AssistantRequest, 
  AssistantResponse, 
  LanguagePreference, 
  ExplanationMode,
  SavedGuidanceItem,
} from '@voteready/shared';
import { postAssistantRequest } from '../lib/apiClient';
import AssistantResponsePreview from './AssistantResponsePreview';
import { saveGuidance } from '../lib/savedGuidanceRepository';
import { useAuth } from '../lib/AuthContext';
import { trackEvent } from '../lib/analytics';
import { detectIntent, IntentResult } from '../lib/intentDetector';
import AssistantQuestionForm from './AssistantQuestionForm';
import SuggestionChips from './SuggestionChips';
import SaveGuidanceAction from './SaveGuidanceAction';

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

    trackEvent('guidance_saved', {
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
        intentCategory: detected.intent,
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
        <span className="safety-icon">✨</span>
        <p>
          I'm powered by Google Gemini and official election sources. I'll help you navigate the process with simple, grounded guidance.
        </p>
      </div>

      <AssistantQuestionForm
        question={question}
        setQuestion={setQuestion}
        language={language}
        setLanguage={setLanguage}
        explanationMode={explanationMode}
        setExplanationMode={setExplanationMode}
        onSubmit={handleSubmit}
        loading={loading}
        showInputHint={showInputHint}
        hintLabel={liveIntent.hintLabel}
        onModeChange={(lang, mode) => trackEvent('mode_changed', { language: lang, explanationMode: mode })}
      />

      {/* Empty / first-time state with intent-aware chips */}
      {showEmptyState && (
        <SuggestionChips
          chips={emptyStateChips}
          onChipClick={handleChipClick}
          label="Try asking:"
          className="assistant-empty-state"
        />
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
              <SaveGuidanceAction
                isSaved={isSaved}
                onSave={handleSave}
                saveConfirmed={saveConfirmed}
                isUserSignedIn={!!user}
              />
            </div>

            <AssistantResponsePreview
              response={response}
              question={question}
              intent={lastIntent}
            />

            {/* Follow-up suggestions */}
            {lastIntent.followUpChips.length > 0 && (
              <div className="followup-section" aria-label="Follow-up suggestions">
                <SuggestionChips
                  chips={lastIntent.followUpChips}
                  onChipClick={handleChipClick}
                  label="You might also want to ask:"
                  className="followup-chips-container"
                  groupLabel="Follow-up questions"
                />
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
