import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ApiStatusCard from './ApiStatusCard';
import { AppMetadataResponse } from '@voteready/shared';

describe('ApiStatusCard', () => {
  const mockMetadata: AppMetadataResponse = {
    appName: 'VoteReady India',
    tagline: 'Ask. Understand. Be vote-ready.',
    apiVersion: '1.0.0',
    environment: 'development',
    supportedLanguages: ['english', 'hindi'],
    supportedExplanationModes: ['quick', 'detailed'],
    generatedAt: '2026-04-28T00:00:00Z',
  };

  it('renders app name and tagline', () => {
    render(<ApiStatusCard metadata={mockMetadata} />);
    expect(screen.getByText('VoteReady India')).toBeInTheDocument();
    expect(screen.getByText('Ask. Understand. Be vote-ready.')).toBeInTheDocument();
  });

  it('renders API version and environment', () => {
    render(<ApiStatusCard metadata={mockMetadata} />);
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('development')).toBeInTheDocument();
  });

  it('renders supported languages', () => {
    render(<ApiStatusCard metadata={mockMetadata} />);
    expect(screen.getByText('english')).toBeInTheDocument();
    expect(screen.getByText('hindi')).toBeInTheDocument();
  });

  it('renders supported explanation modes', () => {
    render(<ApiStatusCard metadata={mockMetadata} />);
    expect(screen.getByText('quick')).toBeInTheDocument();
    expect(screen.getByText('detailed')).toBeInTheDocument();
  });
});
