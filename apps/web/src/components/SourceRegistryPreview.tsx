import React from 'react';
import { SourceRegistryResponse, SourceFreshnessStatus } from '@voteready/shared';

interface SourceRegistryPreviewProps {
  registry: SourceRegistryResponse;
}

const getFreshnessLabel = (status: SourceFreshnessStatus): string => {
  switch (status) {
    case 'verified': return 'Verified';
    case 'review_due': return 'Review due';
    case 'stale': return 'Stale';
    case 'archived': return 'Archived';
    case 'unverified': return 'Unverified';
    default: return status;
  }
};

const getFreshnessHelperText = (status: SourceFreshnessStatus): string => {
  switch (status) {
    case 'verified': return 'Checked by an approved verification workflow.';
    case 'review_due': return 'Requires review before current procedural use.';
    case 'stale': return 'Information may be outdated.';
    case 'archived': return 'Historical record only.';
    case 'unverified': return 'Has not been verified.';
    default: return '';
  }
};

const SourceRegistryPreview: React.FC<SourceRegistryPreviewProps> = ({ registry }) => {
  return (
    <div className="card">
      <h2>Source Registry Preview</h2>

      <div className="dev-note" style={{ marginBottom: '1.5rem' }}>
        <p><strong>Important Note:</strong> This is a source registry metadata preview only. It does not provide procedural election guidance (such as exact dates, eligibility rules, or polling instructions).</p>
        <p style={{ marginTop: '0.5rem' }}>Sources labeled as <strong>Review due</strong> require manual review before their procedural data can be used in active guidance.</p>
      </div>

      <p><span className="label">Total Sources:</span> {registry.count}</p>

      <div className="source-list">
        {registry.sources.map(source => (
          <div key={source.id} className="source-item">
            <span className="source-title">{source.title}</span>
            <div className="source-meta" style={{ marginTop: '0.5rem' }}>
              <span className={`badge ${source.freshnessStatus === 'verified' ? 'badge-fresh' : 'badge-stale'}`}>
                {getFreshnessLabel(source.freshnessStatus)}
              </span>
              <span className="freshness-helper">
                {getFreshnessHelperText(source.freshnessStatus)}
              </span>
              <span style={{ display: 'block', marginTop: '0.5rem' }}>
                {source.sourceType.replaceAll('_', ' ')} • {source.jurisdictionLevel.replaceAll('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', marginTop: '1rem', fontStyle: 'italic', color: '#718096' }}>
        Note: Metadata preview only. These records represent approved official sources.
      </p>
    </div>
  );
};

export default SourceRegistryPreview;

