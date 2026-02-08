import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const getStoredAuth = () => {
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('token')
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null
  }
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => getStoredAuth())

  const login = (userData, authToken) => {
    setAuthState({ user: userData, token: authToken })
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    setAuthState({ user: null, token: null })
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = {
    user: authState.user,
    token: authState.token,
    loading: false,
    login,
    logout,
    isAuthenticated: !!authState.token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
