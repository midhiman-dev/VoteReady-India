import { useState } from 'react';
import { 
  AssistantRequest, 
  AssistantResponse, 
  LanguagePreference, 
  ExplanationMode 
} from '@voteready/shared';
import { postMockAssistantRequest } from '../lib/apiClient';
import AssistantResponsePreview from './AssistantResponsePreview';

export default function MockAssistantContractPanel() {
  const [question, setQuestion] = useState('Can you confirm the assistant contract is connected?');
  const [language, setLanguage] = useState<LanguagePreference>('simple_english');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('simple');
  
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const request: AssistantRequest = {
      question,
      language,
      explanationMode
    };

    try {
      const data = await postMockAssistantRequest(request);
      setResponse(data);
    } catch (err) {
      console.error('Error calling mock assistant API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mock-panel">
      <h2>Mock Assistant Contract Test</h2>
      <div className="dev-note">
        <p><strong>Note:</strong> This is a development-only mock endpoint. It does not provide real election guidance yet.</p>
      </div>

      <form onSubmit={handleSubmit} className="mock-form">
        <div className="form-group">
          <label htmlFor="question" className="label">Test Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Enter a test question..."
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
              <option value="english">English</option>
              <option value="simple_english">Simple English</option>
              <option value="hinglish">Hinglish</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mode" className="label">Mode:</label>
            <select
              id="mode"
              value={explanationMode}
              onChange={(e) => setExplanationMode(e.target.value as ExplanationMode)}
            >
              <option value="quick">Quick</option>
              <option value="simple">Simple</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Testing Contract...' : 'Submit Mock Request'}
        </button>
      </form>

      {error && (
        <div className="error mini-error">
          <p><strong>API Error:</strong> {error}</p>
        </div>
      )}

      {response && (
        <div className="response-section">
          <h3>Mock Response</h3>
          <AssistantResponsePreview response={response} />
        </div>
      )}
    </div>
  );
}
