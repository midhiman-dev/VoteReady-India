import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssistantShell from './AssistantShell';
import { postAssistantRequest } from '../lib/apiClient';
import { AssistantResponse } from '@voteready/shared';
import { useAuth } from '../lib/AuthContext';
import { saveGuidance } from '../lib/savedGuidanceRepository';

// Mock the API client
vi.mock('../lib/apiClient', () => ({
  postAssistantRequest: vi.fn(),
}));

// Mock the repository
vi.mock('../lib/savedGuidanceRepository', () => ({
  saveGuidance: vi.fn(),
}));

// Mock Auth
vi.mock('../lib/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AssistantShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: null, loading: false });
  });

  it('renders title and safety messaging', () => {
    render(<AssistantShell />);
    expect(screen.getByText('Ask VoteReady')).toBeInTheDocument();
    expect(screen.getByText(/can't verify real election guidance yet/i)).toBeInTheDocument();
  });

  it('renders empty default question', () => {
    render(<AssistantShell />);
    const textarea = screen.getByLabelText(/ask a question/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('renders suggested question chips in empty state', () => {
    render(<AssistantShell />);
    expect(screen.getByRole('group', { name: /suggested questions/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/ask: how do i register to vote/i)).toBeInTheDocument();
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
    
    const textarea = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textarea, { target: { value: 'Can VoteReady India answer questions yet?' } });

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

    // The disclaimer from the mock response should be present
    expect(screen.getByText('This is a test response.')).toBeInTheDocument();
  });

  it('displays error state if the mocked API client rejects', async () => {
    vi.mocked(postAssistantRequest).mockRejectedValueOnce(new Error('Network Error'));

    render(<AssistantShell />);
    
    const textarea = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textarea, { target: { value: 'test question' } });
    const submitBtn = screen.getByRole('button', { name: /ask assistant/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('saves an assistant response when Save button is clicked', async () => {
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
    
    // Type a question and submit
    const textarea = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textarea, { target: { value: 'test question' } });
    fireEvent.click(screen.getByRole('button', { name: /ask assistant/i }));

    await waitFor(() => {
      expect(screen.getByText('This is a short answer.')).toBeInTheDocument();
    });

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /save response locally/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(saveGuidance).toHaveBeenCalled();
      expect(screen.getByText(/✓ saved locally/i)).toBeInTheDocument();
    });
  });

  it('shows Save to Cloud when user is signed in', async () => {
    (useAuth as any).mockReturnValue({ user: { uid: 'user-123' }, loading: false });

    const mockResponse: AssistantResponse = {
      id: 'assistant-resp-456',
      status: 'answered',
      language: 'simple_english',
      explanationMode: 'simple',
      answerBlocks: [{ type: 'short_answer', content: 'Short answer.' }],
      sources: [],
      generatedAt: '2026-04-28T00:00:00Z',
    };
    vi.mocked(postAssistantRequest).mockResolvedValueOnce(mockResponse);

    render(<AssistantShell />);
    fireEvent.change(screen.getByLabelText(/ask a question/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: /ask assistant/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save response to your account/i })).toBeInTheDocument();
      expect(screen.getByText(/Save to Cloud/i)).toBeInTheDocument();
    });
  });

  it('shows input intent hint when typing an eligibility question', async () => {
    render(<AssistantShell />);
    const textarea = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textarea, { target: { value: 'Am I eligible to vote?' } });
    // Hint appears after 8+ chars and detected intent
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/eligibility/i)).toBeInTheDocument();
  });

  it('shows follow-up chips after a response is received', async () => {
    const mockResponse: AssistantResponse = {
      id: 'resp-followup',
      status: 'answered',
      language: 'simple_english',
      explanationMode: 'simple',
      answerBlocks: [
        { type: 'short_answer', content: 'You can register on the NVSP portal.' },
      ],
      sources: [],
      generatedAt: '2026-04-28T00:00:00Z',
    };

    vi.mocked(postAssistantRequest).mockResolvedValueOnce(mockResponse);

    render(<AssistantShell />);

    const textarea = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textarea, { target: { value: 'How do I register to vote?' } });
    fireEvent.click(screen.getByRole('button', { name: /ask assistant/i }));

    await waitFor(() => {
      expect(screen.getByText('You can register on the NVSP portal.')).toBeInTheDocument();
    });

    // Follow-up section should appear
    expect(screen.getByText(/you might also want to ask/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /follow-up questions/i })).toBeInTheDocument();
  });
});
