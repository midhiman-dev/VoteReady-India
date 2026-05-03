import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SourceRegistryPreview from './SourceRegistryPreview';
import { SourceRegistryResponse } from '@voteready/shared';

describe('SourceRegistryPreview', () => {
  const mockRegistry: SourceRegistryResponse = {
    count: 2,
    generatedAt: '2026-04-28T00:00:00Z',
    sources: [
      {
        id: 'eci-site',
        title: 'ECI Website',
        sourceType: 'eci_official',
        jurisdictionLevel: 'national',
        publisher: 'ECI',
        freshnessStatus: 'verified',
        url: 'https://eci.gov.in',
        summary: 'Official ECI Website',
      },
      {
        id: 'state-sec',
        title: 'State SEC',
        sourceType: 'government_open_data',
        jurisdictionLevel: 'state',
        publisher: 'State',
        freshnessStatus: 'review_due',
        summary: 'State SEC Website',
      },
    ],
  };

  it('renders source count', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders source titles', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByText('ECI Website')).toBeInTheDocument();
    expect(screen.getByText('State SEC')).toBeInTheDocument();
  });

  it('renders source types and jurisdiction levels', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByText(/eci official • national/i)).toBeInTheDocument();
    expect(screen.getByText(/government open data • state/i)).toBeInTheDocument();
  });

  it('renders freshness status with human-readable labels', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByLabelText(/freshness: verified/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/freshness: review due/i)).toBeInTheDocument();
  });

  it('renders helper text for freshness states', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByText('Requires review before current procedural use.')).toBeInTheDocument();
  });

  it('renders safety note about metadata preview', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    expect(screen.getByText(/This is a source registry metadata preview/i)).toBeInTheDocument();
  });

  it('does not imply review-due sources are verified', () => {
    render(<SourceRegistryPreview registry={mockRegistry} />);
    const reviewDueElement = screen.getByLabelText(/freshness: review due/i);
    expect(reviewDueElement).not.toHaveClass('badge-fresh');
    expect(reviewDueElement).toHaveClass('badge-stale');
  });

});

