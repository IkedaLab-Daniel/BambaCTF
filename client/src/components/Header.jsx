import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import avatar from '../assets/avatar.jpeg'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <header>
      <span>Text Here</span>
      <div className="user">
        <span className="username">
            @{user?.username || 'guest'}
        </span>
        <img src={avatar} alt="" />
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

export default Header
