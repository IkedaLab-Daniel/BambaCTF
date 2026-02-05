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
    </div>
  )
}

export default Sidebar
