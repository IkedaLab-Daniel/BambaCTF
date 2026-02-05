import Header from '../components/Header'
import Home from '../components/Home'
import Sidebar from '../components/Sidebar'

import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div>
        <Header />
        <Home />
      </div>
    </div>
  )
}

export default Dashboard
