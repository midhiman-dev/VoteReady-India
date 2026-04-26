import React from 'react';
import { AppMetadataResponse } from '@voteready/shared';

interface ApiStatusCardProps {
  metadata: AppMetadataResponse;
}

const ApiStatusCard: React.FC<ApiStatusCardProps> = ({ metadata }) => {
  return (
    <div className="card">
      <h2>API Metadata</h2>
      <p><span className="label">Environment:</span> {metadata.environment}</p>
      <p><span className="label">API Version:</span> {metadata.apiVersion}</p>
      <p><span className="label">Generated:</span> {new Date(metadata.generatedAt).toLocaleString()}</p>
      
      <div>
        <span className="label">Supported Languages:</span>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          {metadata.supportedLanguages.map(lang => (
            <li key={lang}>{lang.replace('_', ' ')}</li>
          ))}
        </ul>
      </div>

      <div>
        <span className="label">Explanation Modes:</span>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          {metadata.supportedExplanationModes.map(mode => (
            <li key={mode}>{mode}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiStatusCard;
