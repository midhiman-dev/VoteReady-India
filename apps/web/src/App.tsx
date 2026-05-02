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
import './App.css'

function App() {
  const [metadata, setMetadata] = useState<AppMetadataResponse | null>(null)
  const [registry, setRegistry] = useState<SourceRegistryResponse | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <header>
        <h1>{APP_NAME}</h1>
        <p className="tagline">{TAGLINE}</p>
      </header>

      <main>
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
          <div className="content-container">
            <AssistantShell onItemSaved={handleRefresh} />

            <SavedGuidancePanel refreshTrigger={refreshTrigger} onItemRemoved={handleRefresh} />
            <ReminderPreferencesPanel />
            <GuidedJourneyChooser />

            <ElectionBasicsExplainer />

            <div className="metadata-grid">
              <ApiStatusCard metadata={metadata} />
              <SourceRegistryPreview registry={registry} />
            </div>
          </div>
        )}


        {!loading && !error && (!metadata || !registry) && (
          <div className="status-card">
            <h2>Web app shell ready</h2>
            <p>This is the foundation for VoteReady India. API connection established but no metadata returned.</p>
          </div>
        )}
      </main>

      <footer>
        <p>© 2026 {APP_NAME} • Built for the Indian Voter</p>
      </footer>
    </div>
  )
}

export default App
