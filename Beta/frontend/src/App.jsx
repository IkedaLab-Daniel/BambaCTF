import './App.css'

function App() {
  const activeOperations = [
    {
      title: 'Web Exploitation',
      desc: 'SQL Injection, XSS, CSRF',
      points: 500,
      progress: 65,
      level: 'Medium',
      cta: 'Continue',
      tone: 'neutral',
    },
    {
      title: 'Cryptography',
      desc: 'Ciphers, Hashing, RSA',
      points: 300,
      progress: 92,
      level: 'Easy',
      cta: 'Complete',
      tone: 'success',
    },
    {
      title: 'Forensics',
      desc: 'File Analysis, Steganography',
      points: 1000,
      progress: 0,
      level: 'Hard',
      cta: 'Start',
      tone: 'muted',
    },
  ]

  const additionalOps = [
    {
      title: 'Reverse Engineering',
      desc: 'Binary Analysis, Assembly',
      points: 750,
      progress: 12,
      level: 'Expert',
    },
    {
      title: 'Open Source Intel',
      desc: 'Public Data, Geo-location',
      points: 200,
      progress: 0,
      level: 'Easy',
    },
  ]

  return (
    <div className="hud">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-badge">CH</span>
          <div>
            <p className="brand-title">CyberHub</p>
            <p className="brand-subtitle">Ethical Hacking</p>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active">
            <span className="nav-icon">DB</span>
            Dashboard
          </button>
          <button className="nav-item">
            <span className="nav-icon">PR</span>
            Profile
          </button>
          <button className="nav-item">
            <span className="nav-icon">LB</span>
            Leaderboard
          </button>
          <button className="nav-item">
            <span className="nav-icon">TL</span>
            Tools
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="ai-tutor">
            <div>
              <p className="ai-title">AI Tutor</p>
              <p className="ai-status">Online</p>
            </div>
            <span className="ai-dot" />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumbs">
            <span className="crumb-icon">HOME</span>
            <span>/</span>
            <span>Challenge Hub</span>
          </div>
          <div className="topbar-metrics">
            <div className="pill">
              <span className="pill-icon">R</span>
              <div>
                <p className="pill-label">Rank</p>
                <p className="pill-value">#42</p>
              </div>
            </div>
            <div className="pill">
              <span className="pill-icon">PTS</span>
              <div>
                <p className="pill-label">Points</p>
                <p className="pill-value">12,450</p>
              </div>
            </div>
          </div>
          <div className="profile">
            <div>
              <p className="profile-name">User_Zero</p>
              <p className="profile-meta">Lvl 12 - Script Kiddie</p>
            </div>
            <span className="profile-avatar">UZ</span>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="welcome-title">
              Welcome back, <span>User_Zero</span>
            </p>
            <p className="welcome-subtitle">
              Your neural link is stable. Select a category below to continue your
              training or consult the AI for tactical support.
            </p>
          </div>
        </section>

        <section className="metrics">
          <div className="metric-card">
            <div>
              <p className="metric-label">Flags Captured</p>
              <p className="metric-value">142</p>
              <p className="metric-trend">+12%</p>
            </div>
            <span className="metric-icon">FLAG</span>
          </div>
          <div className="metric-card">
            <div>
              <p className="metric-label">Current Streak</p>
              <p className="metric-value">7 Days</p>
              <p className="metric-trend success">Active</p>
            </div>
            <span className="metric-icon">STK</span>
          </div>
          <div className="metric-card">
            <div>
              <p className="metric-label">Skill Level</p>
              <p className="metric-value">Intermediate</p>
              <p className="metric-trend">Top 15%</p>
            </div>
            <span className="metric-icon">SKL</span>
          </div>
          <div className="metric-card highlight">
            <div>
              <p className="metric-label">Daily Challenge</p>
              <p className="metric-value">Buffer Overflow 101</p>
              <p className="metric-link">Start Now -></p>
            </div>
            <span className="metric-icon">NEW</span>
          </div>
        </section>

        <section className="section-header">
          <div>
            <h2>Active Operations</h2>
            <p>Continue your current missions or start a new engagement.</p>
          </div>
          <button className="link-button">View All Categories</button>
        </section>

        <section className="cards">
          {activeOperations.map((operation) => (
            <article key={operation.title} className="op-card">
              <div className="op-top">
                <span className="op-points">{operation.points} PTS</span>
                <span className={`op-tag ${operation.level.toLowerCase()}`}>
                  {operation.level}
                </span>
              </div>
              <h3>{operation.title}</h3>
              <p>{operation.desc}</p>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${operation.progress}%` }}
                />
              </div>
              <div className="op-footer">
                <span>{operation.progress}%</span>
                <button className={`cta ${operation.tone}`}>{operation.cta}</button>
              </div>
            </article>
          ))}
        </section>

        <section className="cards secondary">
          {additionalOps.map((operation) => (
            <article key={operation.title} className="op-card compact">
              <div className="op-top">
                <span className="op-points">{operation.points} PTS</span>
                <span className={`op-tag ${operation.level.toLowerCase()}`}>
                  {operation.level}
                </span>
              </div>
              <h3>{operation.title}</h3>
              <p>{operation.desc}</p>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${operation.progress}%` }}
                />
              </div>
              <div className="op-footer">
                <span>{operation.progress}%</span>
                <button className="cta muted">Start</button>
              </div>
            </article>
          ))}
        </section>

        <div className="ai-companion">
          <div>
            <p className="ai-title">AI Companion</p>
            <p className="ai-desc">How can I assist?</p>
          </div>
          <button className="ai-button">Ask</button>
        </div>
      </main>
    </div>
  )
}

export default App
