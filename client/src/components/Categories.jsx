import { Globe, Search, Lock } from 'lucide-react'
import './Categories.css'
import { NavLink } from 'react-router-dom'

const Categories = () => {
  return (
    <div className='categories'>
      <h2>Categories</h2>

      <div className="category-grid">
        <div className="category-card">
            <div className="category-header">
              <Globe size={32} />
              <p>Web Exploitation</p>
            </div>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <NavLink to="/categories/webexploitation">
                <button>View Challenges</button>
            </NavLink>
        </div>

        <div className="category-card">
            <div className="category-header">
              <Search size={32} />
              <p>Forensics</p>
            </div>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <NavLink to="/categories/forensics">
                <button>View Challenges</button>
            </NavLink>
        </div>
        
        <div className="category-card">
            <div className="category-header">
              <Lock size={32} />
              <p>Cryptography</p>
            </div>
            <p>Total points: 1000 PTS</p>
            <div className="progress-wrapper">
                <p className='progress'>Progress</p>
                <p className='flag-count'>1/30 Flags</p>
            </div>
            
            {/* progress bar */}
            <NavLink to="/categories/crpytography">
                <button>View Challenges</button>
            </NavLink>
        </div>

      </div>
    </div>
  )
}

export default Categories
