import { useState } from 'react'
import './styles/Dashboard.css'
import './styles/Analytics.css'
import './styles/Auth.css'
import './styles/Settings.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TasksProvider } from './context/TasksContext'
import AuthPage from './components/auth/AuthPage'
import Sidebar, { type Tab } from './components/Sidebar'
import Header from './components/Header'
import DashboardOverview from './components/DashboardOverview'
import TaskListView from './components/TaskListView'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import SettingsView from './components/settings/SettingsView'

function AppShell() {
  const { currentUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (!currentUser) return <AuthPage />

  const navigate = (tab: Tab) => setActiveTab(tab)

  return (
    <TasksProvider>
      <div className="dashboard-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="main-content">
          <Header
            onMenuToggle={() => setIsSidebarOpen(true)}
            onNavigate={navigate}
          />
          <div className="content-body">
            {activeTab === 'dashboard' && (
              <div className="dashboard-view">
                <div className="dashboard-header-text">
                  <h1 className="dashboard-title">Dashboard Overview</h1>
                  <p className="dashboard-subtitle">Welcome back! Here's what's happening with your team.</p>
                </div>
                <DashboardOverview />
              </div>
            )}
            {activeTab === 'tasks' && (
              <div className="dashboard-view">
                <div className="dashboard-header-text">
                  <h1 className="dashboard-title">Team Tasks</h1>
                  <p className="dashboard-subtitle">Manage, track, and update your team's work.</p>
                </div>
                <TaskListView />
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="reports-view">
                <AnalyticsDashboard />
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="dashboard-view">
                <SettingsView />
              </div>
            )}
          </div>
        </main>
      </div>
    </TasksProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
