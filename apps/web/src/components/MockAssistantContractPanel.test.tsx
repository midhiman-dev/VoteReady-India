import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MockAssistantContractPanel from './MockAssistantContractPanel';
import { postMockAssistantRequest } from '../lib/apiClient';
import { AssistantResponse, DEFAULT_MOCK_ASSISTANT_QUESTION } from '@voteready/shared';

// Mock the API client
vi.mock('../lib/apiClient', () => ({
  postMockAssistantRequest: vi.fn(),
}));

describe('MockAssistantContractPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and safety messaging', () => {
    render(<MockAssistantContractPanel />);
    expect(screen.getByText('Mock Assistant Contract Test')).toBeInTheDocument();
    expect(screen.getByText(/development-only mock endpoint/i)).toBeInTheDocument();
  });

  it('renders default mock question', () => {
    render(<MockAssistantContractPanel />);
    const textarea = screen.getByLabelText(/test question/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe(DEFAULT_MOCK_ASSISTANT_QUESTION);
  });

  it('renders language options', () => {
    render(<MockAssistantContractPanel />);
    const select = screen.getByLabelText(/language/i) as HTMLSelectElement;
    const options = Array.from(select.options).map(o => o.value);
    expect(options).toContain('english');
    expect(options).toContain('simple_english');
    expect(options).toContain('hinglish');
    expect(options).toContain('hindi');
  });

  it('renders explanation mode options', () => {
    render(<MockAssistantContractPanel />);
    const select = screen.getByLabelText(/mode/i) as HTMLSelectElement;
    const options = Array.from(select.options).map(o => o.value);
    expect(options).toContain('quick');
    expect(options).toContain('simple');
    expect(options).toContain('detailed');
  });

  it('submits a valid mock assistant request and displays response', async () => {
    const mockResponse: AssistantResponse = {
      id: 'mock-resp-123',
      status: 'answered',
      language: 'simple_english',
      explanationMode: 'simple',
      answerBlocks: [
        {
          type: 'short_answer',
          content: 'To register to vote, you need to fill Form 6.',
        },
      ],
      sources: [],
      generatedAt: '2026-04-28T00:00:00Z',
      disclaimer: 'This is a mock response.',
    };

    vi.mocked(postMockAssistantRequest).mockResolvedValueOnce(mockResponse);

    render(<MockAssistantContractPanel />);
    
    const submitBtn = screen.getByRole('button', { name: /submit mock request/i });
    fireEvent.click(submitBtn);

    expect(postMockAssistantRequest).toHaveBeenCalledWith({
      question: DEFAULT_MOCK_ASSISTANT_QUESTION,
      language: 'simple_english',
      explanationMode: 'simple',
    });

    await waitFor(() => {
      expect(screen.getByText('To register to vote, you need to fill Form 6.')).toBeInTheDocument();
    });

    expect(screen.getByText('Sources returned: 0')).toBeInTheDocument();
  });

  it('displays error state if the mocked API client rejects', async () => {
    vi.mocked(postMockAssistantRequest).mockRejectedValueOnce(new Error('Network Error'));

    render(<MockAssistantContractPanel />);
    
    const submitBtn = screen.getByRole('button', { name: /submit mock request/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
