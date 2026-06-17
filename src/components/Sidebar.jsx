import { NavLink } from 'react-router-dom'
import { Icon, Svg } from './ui'
import { useStore } from '../store'
import { download } from '../utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Icon.dashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Icon.leads },
  { to: '/projects', label: 'Projects', icon: Icon.projects },
  { to: '/invoices', label: 'Invoices', icon: Icon.invoices },
  { to: '/income', label: 'Income', icon: Icon.income },
  { to: '/expenses', label: 'Expenses', icon: Icon.expenses },
  { to: '/analytics', label: 'Analytics', icon: Icon.analytics },
  { to: '/settings', label: 'Settings', icon: Icon.settings },
  { to: '/guide', label: 'Guide', icon: Icon.guide },
]

export default function Sidebar({ open = false, onClose = () => {} }) {
  const store = useStore()

  function exportJson() {
    download('freelance-os-backup.json', JSON.stringify(store.data, null, 2), 'application/json')
  }

  function importJson(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        store.importData(JSON.parse(reader.result))
      } catch {
        alert('That file is not valid backup JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="brand">
        <span className="logo">⚡</span>
        <div>
          Freelance OS
          <small>Business cockpit</small>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onClose}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <Svg d={n.icon} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="foot">
        <div className="mini">Data saved in this browser</div>
        <button className="btn sm ghost" style={{ color: '#cbd5e1', borderColor: 'rgba(148,163,184,.25)' }} onClick={exportJson}>
          <Svg d={Icon.download} /> Export backup
        </button>
        <label className="btn sm ghost" style={{ color: '#cbd5e1', borderColor: 'rgba(148,163,184,.25)', cursor: 'pointer' }}>
          <Svg d={Icon.upload} /> Import backup
          <input type="file" accept="application/json" onChange={importJson} style={{ display: 'none' }} />
        </label>
      </div>
    </aside>
  )
}
