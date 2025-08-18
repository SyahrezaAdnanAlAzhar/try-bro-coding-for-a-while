import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastProvider } from './components/Toast'
import LoginPage from './pages/LoginPage'
import { ProtectedRoute } from './router/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/*" 
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastProvider />
    </>
  )
}

export default App
