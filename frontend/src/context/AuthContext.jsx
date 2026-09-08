import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'
const AuthContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
export function AuthProvider({ children }) {
  const hasToken = Boolean(localStorage.getItem('tasktrack_token'))
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(hasToken)
  useEffect(() => { if (hasToken) api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('tasktrack_token')).finally(() => setLoading(false)) }, [hasToken])
  const authenticate = async (path, values) => { const { data } = await api.post(`/auth/${path}`, values); localStorage.setItem('tasktrack_token', data.token); setUser(data.user); return data.user }
  const logout = () => { localStorage.removeItem('tasktrack_token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login: (v) => authenticate('login', v), register: (v) => authenticate('register', v), logout }}>{children}</AuthContext.Provider>
}
