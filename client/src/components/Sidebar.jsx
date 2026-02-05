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
        <div className="btn-link">
            <PanelsTopLeft />
            <span>Dashboard</span>
        </div>

        <div className="btn-link">
            <User />
            <span>Profile</span>
        </div>

        <div className="btn-link">
            <Trophy />
            <span>Leaderboard</span>
        </div>

        <div className="btn-link">
            <Wrench />
            <span>Tools</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
