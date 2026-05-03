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

  it('renders status and ID', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByLabelText(/Response status: answered/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Response ID: resp-123/i)).toBeInTheDocument();
  });

  it('renders metadata', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText('english')).toBeInTheDocument();
    expect(screen.getByText('detailed')).toBeInTheDocument();
  });

  it('renders answer blocks', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('This is the content.')).toBeInTheDocument();
  });

  it('renders freshness summary and disclaimer', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText('Data is fresh.')).toBeInTheDocument();
    expect(screen.getByText('Use at your own risk.')).toBeInTheDocument();
  });

  it('renders source count', () => {
    render(<AssistantResponsePreview response={mockResponse} />);
    expect(screen.getByText('Sources returned: 0')).toBeInTheDocument();
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
    expect(screen.getByText('Sources returned: 1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /source metadata/i })).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByLabelText(/source freshness: review due/i)).toBeInTheDocument();
    expect(screen.getByRole('note', { name: /source safety note/i })).toBeInTheDocument();
  });
});
