/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { loginApi } from '../api/authApi'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    if (!localStorage.getItem('credentials')) return null
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(username, password) {
    setLoading(true)
    setError('')
    try {
      const { credentials, user: userData } = await loginApi(username, password)
      localStorage.setItem('credentials', credentials)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      const status = err.response?.status
      if (status === 401) setError('Invalid username or password.')
      else if (!err.response) setError('Cannot connect to server.')
      else setError(`Login failed (${status}).`)
      return false
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('credentials')
    localStorage.removeItem('user')
    setUser(null)
    setError('')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
