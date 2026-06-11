import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Results from './pages/Results'

// Wrapper for routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore()

  if (isCheckingAuth) {
    return null; // Will show the main app loading state instead
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Wrapper for guest-only routes (login, register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore()

  if (isCheckingAuth) {
    return null; // Will show the main app loading state instead
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#131314] flex flex-col items-center justify-center">
        {/* Pulsing loading circle */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <div className="absolute w-8 h-8 rounded-full bg-blue-500/10 animate-ping"></div>
        </div>
        <h2 className="text-xl font-medium text-gray-300 tracking-wide animate-pulse font-logo">
          Lumen
        </h2>
        <p className="text-slate-400 text-xs max-w-xs text-center leading-relaxed animate-pulse">
          Waking up our backend server on Render. This may take up to a minute on the first load. <br />Thank you for your patience!
        </p>
      </div>
    )
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/results/:sessionId"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App