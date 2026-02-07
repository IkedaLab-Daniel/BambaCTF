import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='right'>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
