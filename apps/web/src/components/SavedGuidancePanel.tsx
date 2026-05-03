import React, { useEffect, useState } from "react";
import { SavedGuidanceItem } from "@voteready/shared";
import { 
  fetchSavedGuidance, 
  removeSavedGuidance, 
  clearSavedGuidance, 
  getSavedGuidanceRepositoryStatus 
} from "../lib/savedGuidanceRepository";
import { useAuth } from "../lib/AuthContext";
import { trackEvent } from "../lib/analytics";
import { formatSnakeCase, formatCapitalize, formatTimestamp } from "../lib/formatters";

interface SavedGuidancePanelProps {
  refreshTrigger?: number;
  onItemRemoved?: () => void;
}

/**
 * SavedGuidancePanel Component
 * Displays saved assistant responses with appropriate cloud/local status.
 */
export const SavedGuidancePanel: React.FC<SavedGuidancePanelProps> = ({ 
  refreshTrigger = 0,
  onItemRemoved 
}) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SavedGuidanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repoStatus = getSavedGuidanceRepositoryStatus(!!user);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSavedGuidance(user?.uid);
      setItems(data);
    } catch (err) {
      console.error("Failed to load saved guidance", err);
      setError("Failed to load saved guidance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reload when refreshTrigger changes, user changes, or on mount
  useEffect(() => {
    if (!authLoading) {
      loadItems();
    }
  }, [refreshTrigger, user, authLoading]);

  // Listen for storage events for local fallback
  useEffect(() => {
    if (!user) {
      window.addEventListener("storage", loadItems);
      return () => window.removeEventListener("storage", loadItems);
    }
  }, [user]);

  const handleRemove = async (id: string) => {
    const item = items.find(i => i.id === id);
    try {
      await removeSavedGuidance(id, user?.uid);
      // Optimistic update or reload
      setItems(prev => prev.filter(i => i.id !== id));

      if (item) {
        trackEvent('saved_guidance_removed', {
          language: item.language,
          explanationMode: item.explanationMode,
          responseStatus: item.responseStatus,
          sourceCount: item.sourceCount,
          storageMode: user ? 'cloud' : 'local'
        });
      }

      if (onItemRemoved) onItemRemoved();
    } catch (err) {
      console.error("Failed to remove item", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleClearAll = async () => {
    const message = user 
      ? "Are you sure you want to clear all cloud-saved guidance? This will remove them from your account."
      : "Are you sure you want to clear all locally saved guidance? This action cannot be undone.";
      
    if (window.confirm(message)) {
      try {
        await clearSavedGuidance(user?.uid);
        setItems([]);
        trackEvent('saved_guidance_cleared', { storageMode: user ? 'cloud' : 'local' });
        if (onItemRemoved) onItemRemoved();
      } catch (err) {
        console.error("Failed to clear items", err);
        alert("Failed to clear items. Please try again.");
      }
    }
  };

  return (
    <section className="card saved-guidance-panel" id="saved-guidance-panel" aria-labelledby="saved-guidance-title">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 id="saved-guidance-title" style={{ margin: 0 }}>Saved Guidance</h2>
        {items.length > 0 && !loading && (
          <button 
            onClick={handleClearAll} 
            className="clear-all-btn"
            aria-label="Clear all saved guidance items"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Safety & Sync Status Banner */}
      <div 
        className={`sync-status-banner ${user ? 'sync-active' : 'sync-local'}`}
        role="status" 
        style={{ 
          borderLeft: `4px solid ${user ? '#27ae60' : '#f39c12'}`, 
          backgroundColor: user ? '#f0fff4' : '#fff9eb', 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          borderRadius: '4px' 
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>{user ? 'Cloud Sync Active' : 'Local Storage Only'}</strong>
          <br />
          <span style={{ fontSize: '0.85rem', color: '#555' }}>{repoStatus.message}</span>
        </p>
      </div>

      <div aria-live="polite">
        {loading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading your saved guidance...</p>
          </div>
        ) : error ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
            <p>{error}</p>
            <button onClick={loadItems} className="retry-btn">Retry</button>
          </div>
        ) : items.length === 0 ? (
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
                    {formatSnakeCase(item.responseStatus)}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {item.localOnlyMarker && !user && <span title="Stored locally on this device">🏠</span>}
                    <span className="saved-item-date">
                      <time dateTime={item.savedTimestamp}>
                        {formatTimestamp(item.savedTimestamp)}
                      </time>
                    </span>
                  </div>
                </div>
                <h3 className="saved-item-question" style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem' }}>{item.question}</h3>
                <p className="saved-item-summary" style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#555' }}>{item.shortSummary}</p>
                <div className="saved-item-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="saved-item-meta" style={{ fontSize: '0.8rem', color: '#777' }}>
                    {formatSnakeCase(item.language)} • {formatCapitalize(item.explanationMode)} • {item.sourceCount} sources
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
