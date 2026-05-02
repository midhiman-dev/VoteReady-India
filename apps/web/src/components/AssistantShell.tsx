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

function formatOptionLabel(val: string): string {
  return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

interface AssistantShellProps {
  onItemSaved?: () => void;
}

export default function AssistantShell({ onItemSaved }: AssistantShellProps) {
  const [question, setQuestion] = useState('Can VoteReady India answer questions yet?');
  const [language, setLanguage] = useState<LanguagePreference>('simple_english');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('simple');
  
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);
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
    if (onItemSaved) onItemSaved();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsSaved(false);

    const request: AssistantRequest = {
      question,
      language,
      explanationMode
    };

    try {
      const data = await postAssistantRequest(request);
      setResponse(data);
    } catch (err) {
      console.error('Error calling assistant API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card assistant-card">
      <h2>Ask VoteReady</h2>
      <div className="safety-note" role="note">
        <p>This assistant shell is connected to the backend, but real source-backed election guidance is not active yet.</p>
      </div>

      <form onSubmit={handleSubmit} className="assistant-form">
        <div className="form-group">
          <label htmlFor="question" className="label">Ask a question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Ask VoteReady..."
            required
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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Thinking...' : 'Ask Assistant'}
        </button>
      </form>

      {error && (
        <div className="error mini-error" role="alert">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {response && (
        <div className="response-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Response</h3>
            {!isSaved ? (
              <button onClick={handleSave} className="save-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                Save Locally
              </button>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#27ae60', fontWeight: 'bold' }}>✓ Saved locally</span>
            )}
          </div>
          <AssistantResponsePreview response={response} />
        </div>
      )}
    </div>
  );
}
