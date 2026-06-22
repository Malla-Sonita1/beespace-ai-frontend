/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Shell applicatif — AuthProvider enveloppé par AppThemeProvider (ConfigProvider).
 */
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import AppThemeProvider from './theme/AppThemeProvider'

function AppContent() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <ChatPage /> : <LoginPage />
}

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppThemeProvider>
  )
}
