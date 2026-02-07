import { NavLink } from 'react-router-dom'
import { PanelsTopLeft, User, Trophy, Wrench } from 'lucide-react'
import './Sidebar.css'
import icon from '../assets/icon.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="logo">
        <img src={icon} alt="" />
        <div className='title'>
            <span>BambaCTF</span>
            <span className='subtitle'>A Prototype</span>
        </div>
      </div>

      <div className="buttons">
        <NavLink to="/" end className={({ isActive }) => isActive ? "btn-link active" : "btn-link"}>
            <PanelsTopLeft />
            <span>Dashboard</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? "btn-link active" : "btn-link"}>
            <User />
            <span>Profile</span>
        </NavLink>

        <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "btn-link active" : "btn-link"}>
            <Trophy />
            <span>Leaderboard</span>
        </NavLink>

        <NavLink to="/tools" className={({ isActive }) => isActive ? "btn-link active" : "btn-link"}>
            <Wrench />
            <span>Tools</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
