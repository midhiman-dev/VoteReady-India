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
    expect(screen.getByText('answered')).toBeInTheDocument();
    expect(screen.getByText('ID: resp-123')).toBeInTheDocument();
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
});
