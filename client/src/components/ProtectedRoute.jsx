import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
