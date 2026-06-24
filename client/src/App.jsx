import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import QuotationRequests from './pages/QuotationRequests'
import VendorResponse from './pages/VendorResponse'
import SmartComparison from './pages/SmartComparison'
import ProfileSettings from './pages/ProfileSettings'

function App() {
  const { theme } = useTheme()

  return (
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>
          <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: theme === 'dark' ? '#0D1A17' : '#ffffff',
                color: theme === 'dark' ? '#DFF5EE' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#1A3028' : '#e5e7eb'}`,
              },
              success: { iconTheme: { primary: '#00C27A', secondary: theme === 'dark' ? '#0D1A17' : '#ffffff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: theme === 'dark' ? '#0D1A17' : '#ffffff' } },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
            <Route path="/quotation-requests" element={<ProtectedRoute><QuotationRequests /></ProtectedRoute>} />
            <Route path="/vendor-response" element={<ProtectedRoute><VendorResponse /></ProtectedRoute>} />
            <Route path="/smart-comparison" element={<ProtectedRoute><SmartComparison /></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
