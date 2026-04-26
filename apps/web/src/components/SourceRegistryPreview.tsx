import React from 'react';
import { SourceRegistryResponse } from '@voteready/shared';

interface SourceRegistryPreviewProps {
  registry: SourceRegistryResponse;
}

const SourceRegistryPreview: React.FC<SourceRegistryPreviewProps> = ({ registry }) => {
  return (
    <div className="card">
      <h2>Source Registry Preview</h2>
      <p><span className="label">Total Sources:</span> {registry.count}</p>
      
      <div className="source-list">
        {registry.sources.map(source => (
          <div key={source.id} className="source-item">
            <span className="source-title">{source.title}</span>
            <div className="source-meta">
              <span className={`badge ${source.freshnessStatus === 'verified' ? 'badge-fresh' : 'badge-stale'}`}>
                {source.freshnessStatus}
              </span>
              <span>{source.sourceType.replace('_', ' ')} • {source.jurisdictionLevel}</span>
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
