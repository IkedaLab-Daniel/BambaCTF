import './App.css'

function App() {
  const challenges = [
    {
      title: 'Vault Echo',
      category: 'Crypto',
      difficulty: 'Easy',
      points: 100,
      blurb: 'Break a repeating key cipher hidden in audit logs.',
    },
    {
      title: 'Kernel Drift',
      category: 'Pwn',
      difficulty: 'Hard',
      points: 450,
      blurb: 'Abuse a constrained syscall surface in a micro-sandbox.',
    },
    {
      title: 'Signal Siphon',
      category: 'Forensics',
      difficulty: 'Medium',
      points: 250,
      blurb: 'Recover a covert channel from a noisy radio capture.',
    },
    {
      title: 'Mirage API',
      category: 'Web',
      difficulty: 'Medium',
      points: 200,
      blurb: 'Hunt the flag behind layered auth and misdirects.',
    },
  ]

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
          <button className="ghost-button">Sign in</button>
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

        <section id="challenges" className="section">
          <div className="section-header">
            <div>
              <h2>Featured Challenges</h2>
              <p>Curated puzzles tuned for the beta experience.</p>
            </div>
            <button className="ghost-button">Browse Library</button>
          </div>
          <div className="challenge-grid">
            {challenges.map((challenge) => (
              <article key={challenge.title} className="challenge-card">
                <div className="challenge-meta">
                  <span>{challenge.category}</span>
                  <span>{challenge.difficulty}</span>
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.blurb}</p>
                <div className="challenge-footer">
                  <span className="points">{challenge.points} pts</span>
                  <button className="primary-button small">Spawn</button>
                </div>
              </article>
            ))}
          </div>
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
