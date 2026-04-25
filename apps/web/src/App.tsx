import { APP_NAME, TAGLINE } from '@voteready/shared'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>{APP_NAME}</h1>
        <p className="tagline">{TAGLINE}</p>
      </header>
      <main>
        <div className="status-card">
          <h2>Web app shell ready</h2>
          <p>This is the foundation for VoteReady India. Future modules will include assistant, source registry, and guided journeys.</p>
        </div>
      </main>
      <footer>
        <p>© 2026 {APP_NAME}</p>
      </footer>
    </div>
  )
}

export default App
