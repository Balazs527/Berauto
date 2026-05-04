import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import CarListPage from './pages/CarListPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GuestRentalPage from './pages/GuestRentalPage'
import ProfilePage from './pages/ProfilePage'
import MyRentalsPage from './pages/MyRentalsPage'
import ClerkDashboardPage from './pages/ClerkDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: 'guest',
    token: '',
    name: '',
    user: null,
  })

  const redirectPathAfterLogin = useMemo(() => {
    if (auth.role === 'admin') {
      return '/admin'
    }
    if (auth.role === 'clerk') {
      return '/clerk'
    }
    return '/'
  }, [auth.role])

  function handleLoginSuccess(payload) {
    const { primaryRole, token, id, email, name, phone, address, roles } =
      payload
        localStorage.setItem("token", token)
    setAuth({
      isAuthenticated: true,
      role: primaryRole,
      token: token || '',
      name: name || '',
      user: { id, email, name, phone, address, roles },
    })
  }

  function handleProfileUpdate(payload) {
    const { primaryRole, token, id, email, name, phone, address, roles } =
      payload

      localStorage.setItem("token", token)

    setAuth({
      isAuthenticated: true,
      role: primaryRole,
      token: token || '',
      name: name || '',
      user: { id, email, name, phone, address, roles },
    })
  }

  function logout() {
    setAuth({
      isAuthenticated: false,
      role: 'guest',
      token: '',
      name: '',
      user: null,
    })
  }

  return (
    <BrowserRouter>
      <Navbar auth={auth} onLogout={logout} />
      <Routes>
        <Route path="/" element={<HomePage auth={auth} />} />
        <Route path="/cars" element={<CarListPage />} />
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? (
              <Navigate to={redirectPathAfterLogin} replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            auth.isAuthenticated ? (
              <Navigate to={redirectPathAfterLogin} replace />
            ) : (
              <RegisterPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/guest-rental" element={<GuestRentalPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute auth={auth} roles={['user', 'clerk', 'admin']}>
              <ProfilePage auth={auth} onProfileUpdate={handleProfileUpdate} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute auth={auth} roles={['user']}>
              <MyRentalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clerk"
          element={
            <ProtectedRoute auth={auth} roles={['clerk']}>
              <ClerkDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute auth={auth} roles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
