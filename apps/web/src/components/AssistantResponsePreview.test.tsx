import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AssistantResponsePreview from './AssistantResponsePreview';
import { AssistantResponse } from '@voteready/shared';

describe('AssistantResponsePreview', () => {
  const mockResponse: AssistantResponse = {
    id: 'resp-123',
    status: 'answered',
    language: 'english',
    explanationMode: 'detailed',
    generatedAt: '2026-04-28T00:00:00Z',
    answerBlocks: [
      {
        type: 'short_answer',
        heading: 'Introduction',
        content: 'This is the content.',
      },
    ],
    freshnessSummary: {
      status: 'verified',
      message: 'Data is fresh.',
    },
    disclaimer: 'Use at your own risk.',
    sources: [],
  };

  it('renders status badge', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByLabelText(/Response status: answered/i)).toBeInTheDocument();
  });

  it('renders language and mode pills', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByTitle('Language')).toBeInTheDocument();
    expect(screen.getByTitle('Explanation mode')).toBeInTheDocument();
  });

  it('renders answer blocks', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText('This is the content.')).toBeInTheDocument();
  });

  it('renders freshness banner and disclaimer', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText(/Data is fresh\./)).toBeInTheDocument();
    expect(screen.getByText('Use at your own risk.')).toBeInTheDocument();
  });

  it('renders the Sources & Verification section heading', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByRole('heading', { name: /sources & verification/i })).toBeInTheDocument();
  });

  it('renders question echo when question prop is provided', () => {
    render(<AssistantResponsePreview response={mockResponse} question="How do I register?" />);
    expect(screen.getByText('How do I register?')).toBeInTheDocument();
  });

  it('does not render question echo when question prop is empty', () => {
    render(<AssistantResponsePreview response={mockResponse} question="" />);
    expect(screen.queryByLabelText('Your question')).not.toBeInTheDocument();
  });

  it('renders source cards when sources are present', () => {
    const responseWithSources: AssistantResponse = {
      ...mockResponse,
      sources: [
        {
          id: 'source-1',
          title: 'Test Source',
          sourceType: 'eci_official',
          jurisdictionLevel: 'national',
          freshnessStatus: 'review_due',
          publisher: 'ECI'
        }
      ]
    };

    render(<AssistantResponsePreview response={responseWithSources} />);
    expect(screen.getByRole('heading', { name: /sources & verification/i })).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByLabelText(/source freshness: ⚠️ review due/i)).toBeInTheDocument();
    expect(screen.getByRole('note', { name: /source safety note/i })).toBeInTheDocument();
  });

  it('shows cannot-verify state for cannot_verify status', () => {
    const cannotVerifyResponse: AssistantResponse = {
      ...mockResponse,
      status: 'cannot_verify',
      answerBlocks: [],
    };
    render(<AssistantResponsePreview response={cannotVerifyResponse} />);
    expect(screen.getByLabelText(/verification status/i)).toBeInTheDocument();
    expect(screen.getByText(/haven't been able to verify/i)).toBeInTheDocument();
  });
});
