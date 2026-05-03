import React, { useEffect, useState } from "react";
import { SavedGuidanceItem } from "@voteready/shared";
import { getSavedGuidance, removeSavedGuidanceItem, clearAllSavedGuidance } from "../lib/savedGuidanceStorage";
import { getSavedGuidanceRepositoryStatus } from "../lib/savedGuidanceRepository";
import { trackEvent } from "../lib/analytics";

interface SavedGuidancePanelProps {
  refreshTrigger?: number;
  onItemRemoved?: () => void;
}

/**
 * SavedGuidancePanel Component
 * Displays locally saved assistant responses with safety messaging.
 */
export const SavedGuidancePanel: React.FC<SavedGuidancePanelProps> = ({ 
  refreshTrigger = 0,
  onItemRemoved 
}) => {
  const [items, setItems] = useState<SavedGuidanceItem[]>([]);
  const repoStatus = getSavedGuidanceRepositoryStatus();

  const loadItems = () => {
    setItems(getSavedGuidance());
  };

  // Reload when refreshTrigger changes or on mount
  useEffect(() => {
    loadItems();
  }, [refreshTrigger]);

  // Listen for storage events from other tabs
  useEffect(() => {
    window.addEventListener("storage", loadItems);
    return () => window.removeEventListener("storage", loadItems);
  }, []);

  const handleRemove = (id: string) => {
    const item = items.find(i => i.id === id);
    removeSavedGuidanceItem(id);
    loadItems();

    if (item) {
      trackEvent('saved_guidance_removed', {
        language: item.language,
        explanationMode: item.explanationMode,
        responseStatus: item.responseStatus,
        sourceCount: item.sourceCount,
        storageMode: 'local'
      });
    }

    if (onItemRemoved) onItemRemoved();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved guidance? This action cannot be undone.")) {
      clearAllSavedGuidance();
      loadItems();
      trackEvent('saved_guidance_cleared', { storageMode: 'local' });
      if (onItemRemoved) onItemRemoved();
    }
  };

  return (
    <section className="card saved-guidance-panel" id="saved-guidance-panel" aria-labelledby="saved-guidance-title">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 id="saved-guidance-title" style={{ margin: 0 }}>Saved Guidance</h2>
        {items.length > 0 && (
          <button 
            onClick={handleClearAll} 
            className="clear-all-btn"
            aria-label="Clear all saved guidance items"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="safety-note local-only-note" role="note" style={{ borderLeft: '4px solid #f39c12', backgroundColor: '#fff9eb', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Saved guidance is stored locally in this browser.</strong> These items are not synced to any server and will be lost if you clear your browser data.
        </p>
      </div>

      <div className="cloud-sync-status" id="cloud-sync-status" role="status" style={{ fontSize: '0.8rem', color: '#666', padding: '0 0.75rem', marginBottom: '1rem', borderLeft: '4px solid #ddd' }}>
        <p style={{ margin: 0 }}>{repoStatus.message}</p>
      </div>

      <div aria-live="polite">
        {items.length === 0 ? (
          <div className="empty-state" role="status" style={{ textAlign: 'center', padding: '2rem', color: '#666', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <p>No saved guidance items yet. Use the assistant to ask questions and save helpful responses.</p>
          </div>
        ) : (
          <div className="saved-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <article key={item.id} className="saved-item-card" id={`saved-item-${item.id}`} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                <div className="saved-item-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                  <span 
                    className="saved-item-status" 
                    style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                    aria-label={`Status: ${item.responseStatus.replace(/_/g, " ")}`}
                  >
                    {item.responseStatus.replace(/_/g, " ")}
                  </span>
                  <span className="saved-item-date">
                    <time dateTime={item.savedTimestamp}>
                      {new Date(item.savedTimestamp).toLocaleDateString()}
                    </time>
                  </span>
                </div>
                <h3 className="saved-item-question" style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem' }}>{item.question}</h3>
                <p className="saved-item-summary" style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#555' }}>{item.shortSummary}</p>
                <div className="saved-item-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="saved-item-meta" style={{ fontSize: '0.8rem', color: '#777' }}>
                    {item.language.replace(/_/g, " ")} • {item.explanationMode} • {item.sourceCount} sources
                  </span>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="remove-btn"
                    aria-label={`Remove saved guidance for: ${item.question}`}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
