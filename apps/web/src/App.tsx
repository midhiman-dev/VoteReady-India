import { useState, useEffect } from 'react'
import { APP_NAME, TAGLINE, AppMetadataResponse, SourceRegistryResponse } from '@voteready/shared'
import { getAppMetadata, getSourceRegistry } from './lib/apiClient'
import ApiStatusCard from './components/ApiStatusCard'
import SourceRegistryPreview from './components/SourceRegistryPreview'
import AssistantShell from './components/AssistantShell'
import { GuidedJourneyChooser } from './components/GuidedJourneyChooser'
import { ElectionBasicsExplainer } from './components/ElectionBasicsExplainer'
import { SavedGuidancePanel } from './components/SavedGuidancePanel'
import { ReminderPreferencesPanel } from './components/ReminderPreferencesPanel'
import { AuthStatusPanel } from './components/AuthStatusPanel'
import './App.css'

type TabId = 'ask' | 'journeys' | 'basics' | 'saved' | 'settings'

function App() {
  const [metadata, setMetadata] = useState<AppMetadataResponse | null>(null)
  const [registry, setRegistry] = useState<SourceRegistryResponse | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('ask')

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const [metaData, registryData] = await Promise.all([
          getAppMetadata(),
          getSourceRegistry()
        ])
        
        setMetadata(metaData)
        setRegistry(registryData)
      } catch (err) {
        console.error('Error fetching API data:', err)
        setError('Unable to reach the API metadata service. Start the API locally and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{APP_NAME}</h1>
        <p className="tagline">{TAGLINE}</p>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <p>Fetching latest API metadata...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && metadata && registry && (
          <div className="tab-content">
            {activeTab === 'ask' && <AssistantShell onItemSaved={handleRefresh} />}
            {activeTab === 'journeys' && <GuidedJourneyChooser />}
            {activeTab === 'basics' && <ElectionBasicsExplainer />}
            {activeTab === 'saved' && <SavedGuidancePanel refreshTrigger={refreshTrigger} onItemRemoved={handleRefresh} />}
            {activeTab === 'settings' && (
              <div className="settings-container">
                <h2 className="settings-title">Settings</h2>
                <div className="settings-grid">
                  <ReminderPreferencesPanel />
                  <AuthStatusPanel />
                </div>
                <div className="metadata-grid">
                  <ApiStatusCard metadata={metadata} />
                  <SourceRegistryPreview registry={registry} />
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && (!metadata || !registry) && (
          <div className="status-card">
            <h2>Web app shell ready</h2>
            <p>This is the foundation for VoteReady India. API connection established but no metadata returned.</p>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${activeTab === 'ask' ? 'active' : ''}`} onClick={() => setActiveTab('ask')}>
          <span className="nav-icon">💬</span>
          <span className="nav-label">Ask</span>
        </button>
        <button className={`nav-btn ${activeTab === 'journeys' ? 'active' : ''}`} onClick={() => setActiveTab('journeys')}>
          <span className="nav-icon">🗺️</span>
          <span className="nav-label">Journeys</span>
        </button>
        <button className={`nav-btn ${activeTab === 'basics' ? 'active' : ''}`} onClick={() => setActiveTab('basics')}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">Basics</span>
        </button>
        <button className={`nav-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          <span className="nav-icon">🔖</span>
          <span className="nav-label">Saved</span>
        </button>
        <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </nav>
    </div>
  )
}

export default App
