import { useEffect, useMemo, useState } from 'react'
import { fetchChallenges, loginUser, registerUser, startChallenge, submitFlag } from './api'
import './App.css'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '')
  const [authError, setAuthError] = useState('')
  const [authStatus, setAuthStatus] = useState('idle')
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })
  const [spawnStatus, setSpawnStatus] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')
  const [submittedFlag, setSubmittedFlag] = useState('')
  const [selectedChallengeId, setSelectedChallengeId] = useState('')
  const [challenges, setChallenges] = useState([])
  const [challengeStatus, setChallengeStatus] = useState('loading')
  const [challengeError, setChallengeError] = useState('')

  useEffect(() => {
    let active = true

    async function loadChallenges() {
      try {
        const data = await fetchChallenges()
        if (active) {
          setChallenges(data)
          setChallengeStatus('ready')
        }
      } catch (error) {
        if (active) {
          setChallengeStatus('error')
          setChallengeError(error.message)
        }
      }
    }

    loadChallenges()

    return () => {
      active = false
    }
  }, [])

  const challengeOptions = useMemo(() => {
    return challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
    }))
  }, [challenges])

  useEffect(() => {
    if (!selectedChallengeId && challengeOptions.length > 0) {
      setSelectedChallengeId(String(challengeOptions[0].id))
    }
  }, [challengeOptions, selectedChallengeId])

  const handleRegister = async (event) => {
    event.preventDefault()
    setAuthStatus('loading')
    setAuthError('')
    try {
      const data = await registerUser(registerForm)
      localStorage.setItem('auth_token', data.token)
      setToken(data.token)
      setAuthStatus('ready')
    } catch (error) {
      setAuthStatus('error')
      setAuthError(error.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthStatus('loading')
    setAuthError('')
    try {
      const data = await loginUser(loginForm)
      localStorage.setItem('auth_token', data.token)
      setToken(data.token)
      setAuthStatus('ready')
    } catch (error) {
      setAuthStatus('error')
      setAuthError(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setToken('')
  }

  const handleStartChallenge = async (challengeId) => {
    if (!token) {
      setSpawnStatus('Please sign in to start a challenge.')
      return
    }
    setSpawnStatus('Starting instance...')
    try {
      await startChallenge(challengeId, token)
      setSpawnStatus('Instance provisioning started.')
    } catch (error) {
      setSpawnStatus(`Failed to start instance. ${error.message}`)
    }
  }

  const handleSubmitFlag = async (event) => {
    event.preventDefault()
    if (!token) {
      setSubmitStatus('Please sign in to submit a flag.')
      return
    }
    if (!selectedChallengeId) {
      setSubmitStatus('Select a challenge first.')
      return
    }
    setSubmitStatus('Submitting...')
    try {
      const data = await submitFlag(selectedChallengeId, submittedFlag, token)
      const result = data.is_correct ? 'Correct! Points awarded.' : 'Incorrect flag.'
      setSubmitStatus(result)
    } catch (error) {
      setSubmitStatus(`Submission failed. ${error.message}`)
    }
  }

  const scoreboard = [
    { team: 'Shellshockers', points: 4120 },
    { team: 'Blue Lantern', points: 3985 },
    { team: 'Hexsmiths', points: 3710 },
    { team: 'PacketPoets', points: 3420 },
  ]

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <p className="brand-name">PicoCTF Enhanced</p>
            <p className="brand-tagline">beta • ethical hacking arena</p>
          </div>
        </div>
        <nav className="site-nav">
          <a href="#challenges">Challenges</a>
          <a href="#instances">Instances</a>
          <a href="#ai">AI Companion</a>
          <a href="#scoreboard">Scoreboard</a>
        </nav>
        <div className="header-actions">
          {token ? (
            <button className="ghost-button" onClick={handleLogout}>
              Sign out
            </button>
          ) : (
            <span className="status-pill">Guest</span>
          )}
          <button className="primary-button">Launch a Challenge</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Isolated sandboxes • live scoring • team play</p>
            <h1>
              Train on real-world cyber puzzles with isolated instances and an
              AI guide that keeps you honest.
            </h1>
            <p className="hero-lede">
              Every challenge spins up its own restricted container with TTL,
              webshell access, and auditable submissions. Build, break, and
              learn in a controlled arena.
            </p>
            <div className="hero-actions">
              <button className="primary-button">Enter Arena</button>
              <button className="ghost-button">View Docs</button>
            </div>
            <div className="hero-stats">
              <div>
                <p className="stat-value">42s</p>
                <p className="stat-label">avg. instance spin-up</p>
              </div>
              <div>
                <p className="stat-value">120</p>
                <p className="stat-label">active challenges</p>
              </div>
              <div>
                <p className="stat-value">1.2k</p>
                <p className="stat-label">beta operators</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-header">
              <p>Live Instance</p>
              <span className="pulse-dot" />
            </div>
            <div className="hero-card-body">
              <p className="terminal-line">$ deploy challenge mirage-api</p>
              <p className="terminal-line">Provisioning container...</p>
              <p className="terminal-line accent">Endpoint: shell.pico.beta</p>
              <p className="terminal-line">TTL: 00:44:12</p>
            </div>
            <div className="hero-card-footer">
              <button className="primary-button small">Open Webshell</button>
              <button className="ghost-button small">Request Hint</button>
            </div>
          </div>
        </section>

        <section className="section auth-section">
          <div className="panel">
            <h2>Register</h2>
            <p>Create a beta account to launch instances and submit flags.</p>
            <form className="form-grid" onSubmit={handleRegister}>
              <input
                placeholder="Username"
                value={registerForm.username}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, username: event.target.value })
                }
              />
              <input
                placeholder="Email (optional)"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, email: event.target.value })
                }
              />
              <input
                placeholder="Password"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, password: event.target.value })
                }
              />
              <button className="primary-button" type="submit">
                Create account
              </button>
            </form>
          </div>
          <div className="panel highlight">
            <h2>Login</h2>
            <p>Use your credentials to access your team space.</p>
            <form className="form-grid" onSubmit={handleLogin}>
              <input
                placeholder="Username"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, username: event.target.value })
                }
              />
              <input
                placeholder="Password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, password: event.target.value })
                }
              />
              <button className="primary-button" type="submit">
                Sign in
              </button>
            </form>
            {authStatus === 'error' && (
              <p className="status-pill status-error">
                {authError || 'Authentication failed.'}
              </p>
            )}
            {token && <p className="status-pill">Signed in.</p>}
          </div>
        </section>

        <section id="challenges" className="section">
          <div className="section-header">
            <div>
              <h2>Featured Challenges</h2>
              <p>Curated puzzles tuned for the beta experience.</p>
            </div>
            <button className="ghost-button">Browse Library</button>
          </div>
          {challengeStatus === 'loading' && (
            <p className="status-pill">Loading challenges...</p>
          )}
          {challengeStatus === 'error' && (
            <p className="status-pill status-error">
              Failed to load challenges. {challengeError || 'Try again soon.'}
            </p>
          )}
          <div className="challenge-grid">
            {challenges.map((challenge) => (
              <article key={challenge.id} className="challenge-card">
                <div className="challenge-meta">
                  <span>{challenge.category?.name || 'Uncategorized'}</span>
                  <span>{challenge.difficulty}</span>
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
                <div className="challenge-footer">
                  <span className="points">{challenge.points} pts</span>
                  <button
                    className="primary-button small"
                    onClick={() => handleStartChallenge(challenge.id)}
                  >
                    Spawn
                  </button>
                </div>
              </article>
            ))}
            {challengeStatus === 'ready' && challenges.length === 0 && (
              <p className="status-pill">No challenges available yet.</p>
            )}
          </div>
          {spawnStatus && <p className="status-pill">{spawnStatus}</p>}
        </section>

        <section id="instances" className="section split">
          <div className="panel">
            <h2>Restricted Webshell</h2>
            <p>
              Sessions are locked to the sandbox with no host mounts, limited
              capabilities, and strict network egress controls.
            </p>
            <div className="terminal">
              <div className="terminal-header">
                <span>webshell • vault-echo</span>
                <span>user@pico</span>
              </div>
              <div className="terminal-body">
                <p>$ ls /challenge</p>
                <p>README.txt flag.txt cipher.py</p>
                <p className="accent">$ python cipher.py --analyze</p>
                <p>...pattern detected...</p>
              </div>
            </div>
            <div className="panel-actions">
              <button className="primary-button">Reconnect</button>
              <button className="ghost-button">Renew TTL</button>
            </div>
            <div className="submission-panel">
              <h3>Submit a Flag</h3>
              <form className="form-grid" onSubmit={handleSubmitFlag}>
                <select
                  value={selectedChallengeId}
                  onChange={(event) => setSelectedChallengeId(event.target.value)}
                >
                  {challengeOptions.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="flag{...}"
                  value={submittedFlag}
                  onChange={(event) => setSubmittedFlag(event.target.value)}
                />
                <button className="primary-button" type="submit">
                  Submit
                </button>
              </form>
              {submitStatus && <p className="status-pill">{submitStatus}</p>}
            </div>
          </div>
          <div className="panel highlight">
            <h2>Authoring Console</h2>
            <p>
              Build challenges with container images, validation scripts, and
              scoring curves. Preview runs in a staging sandbox.
            </p>
            <ul className="feature-list">
              <li>Image registry hooks + secrets vault</li>
              <li>Flag rotation + health checks</li>
              <li>Automatic hint reveal cadence</li>
            </ul>
            <button className="primary-button">Open Admin Studio</button>
          </div>
        </section>

        <section id="ai" className="section ai-section">
          <div className="ai-panel">
            <h2>AI Companion</h2>
            <p>
              Ask for guard-railed hints. Every exchange is rate limited and
              logged for audit.
            </p>
            <div className="chat-window">
              <div className="chat-bubble user">
                I found a base64 string in the logs. What next?
              </div>
              <div className="chat-bubble assistant">
                Check for layered encoding. Try base64 decode, then see if the
                result matches a cipher signature. Want a quick script?
              </div>
              <div className="chat-bubble user">
                Yes, but keep it high-level.
              </div>
            </div>
            <div className="chat-input">
              <input placeholder="Ask the companion..." />
              <button className="primary-button small">Send</button>
            </div>
          </div>
          <div className="ai-metrics">
            <div className="metric-card">
              <p className="metric-value">30/min</p>
              <p className="metric-label">rate limit per team</p>
            </div>
            <div className="metric-card">
              <p className="metric-value">100%</p>
              <p className="metric-label">prompt audit coverage</p>
            </div>
            <div className="metric-card">
              <p className="metric-value">7d</p>
              <p className="metric-label">log retention (beta)</p>
            </div>
          </div>
        </section>

        <section id="scoreboard" className="section scoreboard">
          <div className="section-header">
            <div>
              <h2>Live Scoreboard</h2>
              <p>Track team progress with continuous updates.</p>
            </div>
            <button className="ghost-button">View Full Board</button>
          </div>
          <div className="scoreboard-grid">
            {scoreboard.map((entry, index) => (
              <div key={entry.team} className="scoreboard-card">
                <span className="rank">#{index + 1}</span>
                <div>
                  <p className="team-name">{entry.team}</p>
                  <p className="team-points">{entry.points} pts</p>
                </div>
                <button className="ghost-button small">Challenge</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <p className="brand-name">PicoCTF Enhanced</p>
          <p className="footer-note">
            Built for ethical hacking education. All actions logged.
          </p>
        </div>
        <div className="footer-links">
          <a href="#challenges">Challenges</a>
          <a href="#ai">AI Companion</a>
          <a href="#instances">Sandbox</a>
          <a href="#scoreboard">Scoreboard</a>
        </div>
      </footer>
    </div>
  )
}

export default App
