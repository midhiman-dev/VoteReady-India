import React from 'react';
import { 
  LanguagePreference, 
  ExplanationMode,
  SUPPORTED_LANGUAGES,
  SUPPORTED_EXPLANATION_MODES,
} from '@voteready/shared';
import { formatSnakeCase, formatCapitalize } from '../lib/formatters';

interface AssistantQuestionFormProps {
  question: string;
  setQuestion: (q: string) => void;
  language: LanguagePreference;
  setLanguage: (l: LanguagePreference) => void;
  explanationMode: ExplanationMode;
  setExplanationMode: (m: ExplanationMode) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  showInputHint: boolean;
  hintLabel?: string;
  onModeChange: (lang: LanguagePreference, mode: ExplanationMode) => void;
}

export default function AssistantQuestionForm({
  question,
  setQuestion,
  language,
  setLanguage,
  explanationMode,
  setExplanationMode,
  onSubmit,
  loading,
  showInputHint,
  hintLabel,
  onModeChange,
}: AssistantQuestionFormProps) {
  return (
    <form onSubmit={onSubmit} className="assistant-form">
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
            <span className="hint-icon">💬</span> {hintLabel}
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
            onChange={e => {
              const newLang = e.target.value as LanguagePreference;
              setLanguage(newLang);
              onModeChange(newLang, explanationMode);
            }}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {formatSnakeCase(lang)}
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
            onChange={e => {
              const newMode = e.target.value as ExplanationMode;
              setExplanationMode(newMode);
              onModeChange(language, newMode);
            }}
          >
            {SUPPORTED_EXPLANATION_MODES.map(mode => (
              <option key={mode} value={mode}>
                {formatCapitalize(mode)}
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
  );
}
