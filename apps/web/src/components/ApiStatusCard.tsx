import React from 'react';
import { AppMetadataResponse } from '@voteready/shared';

interface ApiStatusCardProps {
  metadata: AppMetadataResponse;
}

const ApiStatusCard: React.FC<ApiStatusCardProps> = ({ metadata }) => {
  return (
    <section className="card" aria-labelledby="api-metadata-title">
      <h2 id="api-metadata-title">API Metadata</h2>
      <p><span className="label">App Name:</span> {metadata.appName}</p>
      <p><span className="label">Tagline:</span> {metadata.tagline}</p>
      <p><span className="label">Environment:</span> {metadata.environment}</p>
      <p><span className="label">API Version:</span> {metadata.apiVersion}</p>
      <p>
        <span className="label">Generated:</span>{' '}
        <time dateTime={metadata.generatedAt}>
          {new Date(metadata.generatedAt).toLocaleString()}
        </time>
      </p>
      
      <div>
        <span className="label" id="supported-languages-label">Supported Languages:</span>
        <ul 
          style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}
          aria-labelledby="supported-languages-label"
        >
          {metadata.supportedLanguages.map(lang => (
            <li key={lang}>{lang.replace('_', ' ')}</li>
          ))}
        </ul>
      </div>

      <div>
        <span className="label" id="explanation-modes-label">Explanation Modes:</span>
        <ul 
          style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}
          aria-labelledby="explanation-modes-label"
        >
          {metadata.supportedExplanationModes.map(mode => (
            <li key={mode}>{mode}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ApiStatusCard;
