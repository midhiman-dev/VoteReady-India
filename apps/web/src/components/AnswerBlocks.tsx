import React from 'react';
import { AssistantResponse } from '@voteready/shared';
import { IntentResult } from '../lib/intentDetector';

interface AnswerBlocksProps {
  response: AssistantResponse;
  intent?: IntentResult;
}

export default function AnswerBlocks({ response, intent }: AnswerBlocksProps) {
  const { answerBlocks, explanationMode, status } = response;

  const shortAnswer   = answerBlocks.find(b => b.type === 'short_answer');
  const contextBlock  = answerBlocks.find(b => b.type === 'what_this_means');
  const nextSteps     = answerBlocks.find(b => b.type === 'next_steps');
  const refusal       = answerBlocks.find(b => b.type === 'neutral_refusal');
  const sourceNote    = answerBlocks.find(b => b.type === 'source_note');

  const isCannotVerify  = status === 'cannot_verify';
  const isOutOfScope    = status === 'out_of_scope';
  const isNonVerifiable = isCannotVerify || isOutOfScope || !!refusal;

  // Intent-aware framing: override generic context with situational copy
  const intentContextText =
    intent && intent.intent !== 'GENERIC_INTENT' && intent.contextFraming
      ? intent.contextFraming
      : null;

  // Use intent framing if available, otherwise fall back to backend block
  const contextText = intentContextText ?? contextBlock?.content ?? null;
  const contextHeading = contextBlock?.heading ?? 'What this means for you';

  return (
    <div className="answer-sections">
      {/* 1. Direct Answer */}
      {shortAnswer && (
        <div
          className={`answer-section answer-section--direct${intent && intent.intent !== 'GENERIC_INTENT' ? ' answer-section--intent-highlighted' : ''}`}
          role="region"
          aria-label="Direct answer"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">💡</span>
            Answer
          </div>
          <p className="answer-section-content answer-direct-text">{shortAnswer.content}</p>
        </div>
      )}

      {/* Cannot-verify / out-of-scope / refusal — friendly state */}
      {isNonVerifiable && (
        <div
          className="answer-section answer-section--cannot-verify"
          role="region"
          aria-label="Verification status"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">🔍</span>
            Verification Status
          </div>
          {refusal ? (
            <p className="answer-section-content">{refusal.content}</p>
          ) : isCannotVerify ? (
            <div className="cannot-verify-message">
              <p>I haven't been able to verify this against an official source yet.</p>
              <p className="cannot-verify-guidance">
                For accurate guidance, please check the official ECI website or Voters' Services
                Portal directly.
              </p>
            </div>
          ) : (
            <p className="answer-section-content">
              This question falls outside what I'm set up to answer safely right now.
            </p>
          )}
        </div>
      )}

      {/* 2. What this means — intent-aware, shown in simple + detailed */}
      {contextText && (explanationMode === 'simple' || explanationMode === 'detailed') && (
        <div
          className="answer-section answer-section--context"
          role="region"
          aria-label="What this means"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">🎯</span>
            {contextHeading}
          </div>
          <p className="answer-section-content">{contextText}</p>
          {/* Badge when using intent override */}
          {intentContextText && (
            <span className="intent-context-badge" aria-label="Personalised context">
              Tailored to your question
            </span>
          )}
        </div>
      )}

      {/* 3. Next steps — only in detailed, with structured preamble */}
      {nextSteps && explanationMode === 'detailed' && (
        <div
          className="answer-section answer-section--next-steps"
          role="region"
          aria-label="Next steps"
        >
          <div className="answer-section-label">
            <span className="answer-section-icon">👣</span>
            {nextSteps.heading || 'Next Steps'}
          </div>
          <div className="next-steps-structure">
            <div className="next-step-row">
              <span className="next-step-num">1</span>
              <span>Understand what this question is about</span>
            </div>
            <div className="next-step-row">
              <span className="next-step-num">2</span>
              <span>Verify details on the official source below</span>
            </div>
            <div className="next-step-row">
              <span className="next-step-num">3</span>
              <span>Once verified sources are connected, I'll guide you step-by-step</span>
            </div>
          </div>
          <p className="answer-section-content next-steps-detail">{nextSteps.content}</p>
          <p className="next-steps-caution">
            Always verify steps on the official ECI or Voters' Services Portal before acting.
          </p>
        </div>
      )}

      {/* Source note */}
      {sourceNote && (
        <div
          className="answer-section answer-section--source-note"
          role="region"
          aria-label="Source note"
        >
          <p className="answer-section-content answer-source-note-text">{sourceNote.content}</p>
        </div>
      )}

      {/* Fallback: other blocks not caught above */}
      {answerBlocks
        .filter(
          b =>
            !['short_answer', 'what_this_means', 'next_steps', 'neutral_refusal', 'source_note'].includes(
              b.type
            )
        )
        .map((block, i) => (
          <div
            key={i}
            className={`answer-section answer-section--other block-${block.type}`}
            role="region"
            aria-label={block.heading || block.type.replace(/_/g, ' ')}
          >
            {block.heading && <div className="answer-section-label">{block.heading}</div>}
            <p className="answer-section-content">{block.content}</p>
          </div>
        ))}
    </div>
  );
}
