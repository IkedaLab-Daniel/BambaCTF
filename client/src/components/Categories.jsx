import './Categories.css'

const Categories = () => {
  return (
    <div className='categories'>
      <h2>Categories</h2>

      <div className="category-grid">
        <div className="category-card">
            <p>Web Exploitation</p>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <button>View Challenges</button>
        </div>

        <div className="category-card">
            <p>Forensics</p>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <button>View Challenges</button>
        </div>
        
        <div className="category-card">
            <p>Cryptography</p>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <button>View Challenges</button>
        </div>

      </div>
    </div>
  )
}

export default Categories
