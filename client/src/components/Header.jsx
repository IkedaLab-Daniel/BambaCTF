import avatar from '../assets/avatar.jpeg'
import './Header.css'

const Header = () => {
  return (
    <header>
      <span>Text Here</span>
      <div className="user">
        <span className="username">
            @eternal_ice
        </span>
        <img src={avatar} alt="" />
      </div>
    </header>
  )
}

export default Header
