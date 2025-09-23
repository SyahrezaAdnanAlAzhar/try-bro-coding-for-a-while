import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastProvider } from './components/ui/Toast'
import LoginPage from './pages/LoginPage'
import { ProtectedRoute } from './router/ProtectedRoute'
import TicketPage from './pages/TicketPage'
import { MainLayout } from './layouts/MainLayout';
import JobPage from './pages/JobPage';
import { AppInitializer } from './components/AppInitializer'
import CreateTicketPage from './pages/CreateTicketPage';
import { Can } from './components/auth/Can';
import ApprovalPage from './pages/ApprovalPage';
import TicketDetailPage from './pages/TicketDetailPage'
import HistoryAllTicketsPage from './pages/HistoryAllTicketsPage'
import HistoryMyTicketsPage from './pages/HistoryMyTicketsPage'
import ReviseTicketPage from './pages/ReviseTicketPage'
import { MasterEditProtection } from './router/MasterEditProtection'
import MasterDepartmentPage from './pages/master/MasterDepartmentPage'
import MasterAreaPage from './pages/master/MasterAreaPage'
import MasterEmployeePage from './pages/master/MasterEmployeePage'
import MasterAuthorizationPage from './pages/master/MasterAuthorizationPage'
import MasterTicketPage from './pages/master/MasterTicketPage'

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

            <Route
              path="/approval"
              element={
                <ProtectedRoute>
                  <Can permission="CREATE_TICKET">
                    <ApprovalPage />
                  </Can>
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-ticket"
              element={
                <ProtectedRoute>
                  <Can permission="CREATE_TICKET">
                    <CreateTicketPage />
                  </Can>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket/:id"
              element={
                <TicketDetailPage />
              }
            />

            <Route
              path="/history/all"
              element={
                <ProtectedRoute>
                  <HistoryAllTicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/my"
              element={
                <ProtectedRoute>
                  <Can permission="CREATE_TICKET">
                    <HistoryMyTicketsPage />
                  </Can>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket/:id/revise"
              element={
                <ProtectedRoute>
                  <Can permission="CREATE_TICKET">
                    <ReviseTicketPage />
                  </Can>
                </ProtectedRoute>
              }
            />

            {/* MASTER USER */}
            <Route
              path="/master/department"
              element={<MasterEditProtection><MasterDepartmentPage /></MasterEditProtection>}
            />
            <Route
              path="/master/area"
              element={<MasterEditProtection><MasterAreaPage /></MasterEditProtection>}
            />
            <Route
              path="/master/employee"
              element={<MasterEditProtection><MasterEmployeePage /></MasterEditProtection>}
            />
            <Route
              path="/master/authorization"
              element={<MasterEditProtection><MasterAuthorizationPage /></MasterEditProtection>}
            />
            <Route
              path="/master/ticket"
              element={<MasterEditProtection><MasterTicketPage /></MasterEditProtection>}
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <ToastProvider />
    </>
  )
}

export default App
