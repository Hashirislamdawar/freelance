import { useState } from 'react'
import { PageHeader, Button, Icon, Svg } from '../components/ui'
import { useStore } from '../store'
import { useCloud } from '../cloud'
import { CURRENCIES } from '../constants'
import { download } from '../utils'

function Section({ title, sub, children }) {
  return (
    <div className="card pad" style={{ marginBottom: 16 }}>
      <div className="card-title">{title}</div>
      {sub && <p className="card-sub" style={{ marginTop: -8, marginBottom: 14 }}>{sub}</p>}
      {children}
    </div>
  )
}

function CloudAccount() {
  const cloud = useCloud()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const run = (fn) => async () => {
    setBusy(true)
    setMsg(null)
    try {
      await fn()
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!cloud.configured) {
    return (
      <Section title="Cloud sync & login" sub="Optional — sync your data across devices.">
        <p style={{ marginTop: 0, color: 'var(--body)' }}>
          Cloud sync is <b>not connected yet</b>. The app works fully offline; to enable login + multi-device sync,
          create a free Supabase project and add its keys:
        </p>
        <ol style={{ lineHeight: 1.9, color: 'var(--body)' }}>
          <li>Create a project at <b>supabase.com</b>.</li>
          <li>In the SQL editor, run the table + policy script from the README (<code>app_state</code>).</li>
          <li>Create a <code>.env</code> file in <code>freelance-os/</code> with your project URL and anon key:</li>
        </ol>
        <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: 14, borderRadius: 10, overflowX: 'auto', fontSize: 12 }}>
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}
        </pre>
        <p className="card-sub">Restart <code>npm run dev</code> after adding the keys.</p>
      </Section>
    )
  }

  if (cloud.session) {
    return (
      <Section title="Cloud sync & login">
        <div className="stat-row">
          <span className="lbl">Signed in as</span>
          <span className="val">{cloud.session.user.email}</span>
        </div>
        <div className="stat-row">
          <span className="lbl">Sync status</span>
          <span className="val" style={{ color: cloud.status === 'error' ? 'var(--red)' : cloud.status === 'synced' ? 'var(--emerald)' : 'var(--muted)' }}>
            {cloud.status === 'syncing' ? 'Syncing…' : cloud.status === 'synced' ? '✓ Synced' : cloud.status === 'error' ? 'Error' : 'Idle'}
          </span>
        </div>
        {cloud.error && <p className="tag-note">{cloud.error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <Button icon={Icon.cloud} onClick={() => cloud.syncNow()}>Sync now</Button>
          <button className="btn" onClick={() => cloud.signOut()}>Sign out</button>
        </div>
      </Section>
    )
  }

  return (
    <Section title="Cloud sync & login" sub="Sign in to sync across devices. Your data uploads automatically.">
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
        </div>
        {msg && <p className="tag-note">{msg}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn primary" disabled={busy} onClick={run(() => cloud.signIn(email, pw))}>Sign in</button>
          <button className="btn" disabled={busy} onClick={run(async () => { await cloud.signUp(email, pw); setMsg('Account created — check your email if confirmation is on, then sign in.') })}>
            Create account
          </button>
        </div>
      </div>
    </Section>
  )
}

export default function Settings() {
  const store = useStore()
  const s = store.data.settings
  const set = (patch) => store.setSettings(patch)

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
    <>
      <PageHeader title="Settings" subtitle="Currency, invoice branding, cloud sync and data." />

      <div className="grid-2">
        <Section title="Currency" sub="Applied across the whole app.">
          <div className="field" style={{ maxWidth: 320 }}>
            <label>Display currency</label>
            <select className="field-select" value={s.currency} onChange={(e) => set({ currency: e.target.value })}
              style={{ border: '1px solid var(--line)', borderRadius: 9, padding: '9px 12px' }}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol}  {c.code} — {c.label}</option>
              ))}
            </select>
          </div>
        </Section>

        <Section title="Annual revenue goal">
          <div className="field" style={{ maxWidth: 320 }}>
            <label>Goal ({s.currency})</label>
            <input type="number" value={s.annualGoal ?? ''} onChange={(e) => set({ annualGoal: e.target.value === '' ? '' : Number(e.target.value) })} />
          </div>
        </Section>
      </div>

      <Section title="Invoice branding" sub="Shown on the PDFs you generate from the Invoices tab.">
        <div className="grid-2">
          <div className="field">
            <label>Business / your name</label>
            <input value={s.businessName || ''} onChange={(e) => set({ businessName: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={s.businessEmail || ''} onChange={(e) => set({ businessEmail: e.target.value })} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={s.businessAddress || ''} onChange={(e) => set({ businessAddress: e.target.value })} />
          </div>
          <div className="field">
            <label>Payment terms / footer</label>
            <input value={s.paymentTerms || ''} onChange={(e) => set({ paymentTerms: e.target.value })} />
          </div>
        </div>
      </Section>

      <CloudAccount />

      <Section title="Data" sub="Your data lives in this browser. Back it up regularly.">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button icon={Icon.download} onClick={() => download('freelance-os-backup.json', JSON.stringify(store.data, null, 2), 'application/json')}>
            Export backup
          </Button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            <Svg d={Icon.upload} /> Import backup
            <input type="file" accept="application/json" onChange={importJson} style={{ display: 'none' }} />
          </label>
          <button className="btn" onClick={() => { if (confirm('Load sample data? This replaces current data.')) store.loadSample() }}>Load sample data</button>
          <button className="btn danger" onClick={() => { if (confirm('Erase ALL data? This cannot be undone.')) store.clearAll() }}>Clear all data</button>
        </div>
      </Section>
    </>
  )
}
