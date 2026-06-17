import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { Svg, Icon } from './components/ui'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Projects from './pages/Projects'
import Invoices from './pages/Invoices'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Guide from './pages/Guide'

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const close = () => setNavOpen(false)
  useLocation() // ensure re-render on route change

  return (
    <div className="app">
      <Sidebar open={navOpen} onClose={close} />
      {navOpen && <div className="nav-overlay" onClick={close} />}
      <div className="content">
        <header className="mobile-topbar">
          <button className="hamburger" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Svg d={Icon.menu} />
          </button>
          <span className="mt-brand">
            <span className="mt-logo">⚡</span> Freelance OS
          </span>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
