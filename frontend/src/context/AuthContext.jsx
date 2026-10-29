import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('tasktrack_token')) {
      setLoading(false)
      return undefined
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('tasktrack_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
    return undefined
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('tasktrack:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('tasktrack:unauthorized', handleUnauthorized)
  }, [])

  const authenticate = async (path, values) => {
    const { data } = await api.post(`/auth/${path}`, values)
    localStorage.setItem('tasktrack_token', data.token)
    setUser(data.user)
    return data.user
  }
  const logout = () => {
    localStorage.removeItem('tasktrack_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login: (values) => authenticate('login', values), register: (values) => authenticate('register', values), logout }}>{children}</AuthContext.Provider>
}
