import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'
import AdminPage from './pages/AdminPage'
import LandingPage from './pages/LandingPage'
import './App.css'
function Protected({ admin = false, children }) { const { user, loading } = useAuth(); if (loading) return <div className="loading full-page">Loading TaskTrack…</div>; if (!user) return <Navigate to="/login" replace />; if (admin && user.role !== 'admin') return <Navigate to="/board" replace />; return children }
export default function App() { return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<Protected><Layout /></Protected>}><Route path="/board" element={<BoardPage />} /><Route path="/admin" element={<Protected admin><AdminPage /></Protected>} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes> }
