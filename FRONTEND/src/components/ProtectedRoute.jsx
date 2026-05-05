import { Navigate } from 'react-router-dom'

function ProtectedRoute({ auth, roles, children }) {
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
