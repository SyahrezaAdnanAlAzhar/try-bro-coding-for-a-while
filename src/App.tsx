import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastProvider } from './components/ui/Toast'
import LoginPage from './pages/LoginPage'
import { ProtectedRoute } from './router/ProtectedRoute'
import TicketPage from './pages/TicketPage'
import { MainLayout } from './layouts/MainLayout';
import JobPage from './pages/JobPage';
import { AppInitializer } from './components/AppInitializer'

function App() {
  return (
    <>
      <BrowserRouter>
        <AppInitializer />
        <MainLayout>
          <Routes>
            <Route path="/" element={<TicketPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/job"
              element={
                <ProtectedRoute>
                  <JobPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <ToastProvider />
    </>
  )
}

export default App
