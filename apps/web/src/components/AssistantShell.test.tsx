import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssistantShell from './AssistantShell';
import { postAssistantRequest } from '../lib/apiClient';
import { AssistantResponse } from '@voteready/shared';

// Mock the API client
vi.mock('../lib/apiClient', () => ({
  postAssistantRequest: vi.fn(),
}));

// Mock the storage
vi.mock('../lib/savedGuidanceStorage', () => ({
  saveGuidanceItem: vi.fn(),
}));

import { saveGuidanceItem } from '../lib/savedGuidanceStorage';

describe('AssistantShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and safety messaging', () => {
    render(<AssistantShell />);
    expect(screen.getByText('Ask VoteReady')).toBeInTheDocument();
    expect(screen.getByText(/real source-backed election guidance is not active yet/i)).toBeInTheDocument();
  });

  it('renders safe default question', () => {
    render(<AssistantShell />);
    const textarea = screen.getByLabelText(/ask a question/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Can VoteReady India answer questions yet?');
  });

  it('renders language options', () => {
    render(<AssistantShell />);
    const select = screen.getByLabelText(/language/i) as HTMLSelectElement;
    const options = Array.from(select.options).map(o => o.value);
    expect(options).toContain('english');
    expect(options).toContain('simple_english');
    expect(options).toContain('hinglish');
    expect(options).toContain('hindi');
  });

  it('renders explanation mode options', () => {
    render(<AssistantShell />);
    const select = screen.getByLabelText(/mode/i) as HTMLSelectElement;
    const options = Array.from(select.options).map(o => o.value);
    expect(options).toContain('quick');
    expect(options).toContain('simple');
    expect(options).toContain('detailed');
  });

  it('submits a valid assistant request and displays response', async () => {
    const mockResponse: AssistantResponse = {
      id: 'assistant-resp-123',
      status: 'answered',
      language: 'simple_english',
      explanationMode: 'simple',
      answerBlocks: [
        {
          type: 'neutral_refusal',
          content: 'I am not able to answer specific voting questions yet.',
        },
      ],
      sources: [],
      generatedAt: '2026-04-28T00:00:00Z',
      disclaimer: 'This is a test response.',
    };

    vi.mocked(postAssistantRequest).mockResolvedValueOnce(mockResponse);

    render(<AssistantShell />);
    
    const submitBtn = screen.getByRole('button', { name: /ask assistant/i });
    fireEvent.click(submitBtn);

    expect(postAssistantRequest).toHaveBeenCalledWith({
      question: 'Can VoteReady India answer questions yet?',
      language: 'simple_english',
      explanationMode: 'simple',
    });

    await waitFor(() => {
      expect(screen.getByText('I am not able to answer specific voting questions yet.')).toBeInTheDocument();
    });

    expect(screen.getByText('Sources returned: 0')).toBeInTheDocument();
  });

  it('displays error state if the mocked API client rejects', async () => {
    vi.mocked(postAssistantRequest).mockRejectedValueOnce(new Error('Network Error'));

    render(<AssistantShell />);
    
    const submitBtn = screen.getByRole('button', { name: /ask assistant/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('saves an assistant response locally when Save button is clicked', async () => {
    const mockResponse: AssistantResponse = {
      id: 'assistant-resp-456',
      status: 'answered',
      language: 'simple_english',
      explanationMode: 'simple',
      answerBlocks: [
        {
          type: 'short_answer',
          content: 'This is a short answer.',
        },
      ],
      sources: [],
      generatedAt: '2026-04-28T00:00:00Z',
    };

    vi.mocked(postAssistantRequest).mockResolvedValueOnce(mockResponse);

    render(<AssistantShell />);
    
    // Submit to get response
    fireEvent.click(screen.getByRole('button', { name: /ask assistant/i }));

    await waitFor(() => {
      expect(screen.getByText('This is a short answer.')).toBeInTheDocument();
    });

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /save response locally/i });
    fireEvent.click(saveBtn);

    expect(saveGuidanceItem).toHaveBeenCalled();
    expect(screen.getByText(/✓ saved locally/i)).toBeInTheDocument();
  });
});
