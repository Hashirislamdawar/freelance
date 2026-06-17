import { PageHeader, Button } from '../components/ui'
import { useStore } from '../store'

export default function Guide() {
  const store = useStore()
  return (
    <>
      <PageHeader title="Guide" subtitle="How the Freelance Business OS works." />

      <div className="grid-2">
        <div className="card pad">
          <div className="card-title">The workflow</div>
          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, color: 'var(--body)' }}>
            <li>Add prospects in <b>Leads</b>. Status &amp; priority colour-code themselves.</li>
            <li>Set a <b>Next Follow-up</b> date — the row turns red when it's due or overdue.</li>
            <li>Enter <b>Deal Value</b> + <b>Win %</b> → weighted pipeline calculates itself.</li>
            <li>Won it? Add it to <b>Projects</b> and bill it in <b>Invoices</b>.</li>
            <li>Mark an invoice <b>Paid</b> (+ date paid) → Income, Analytics &amp; Dashboard update live.</li>
            <li>Log costs in <b>Expenses</b> → net profit &amp; margin appear instantly.</li>
          </ol>
        </div>

        <div className="card pad">
          <div className="card-title">Good to know</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, color: 'var(--body)' }}>
            <li><b>Everything auto-saves</b> to this browser — no account, no server.</li>
            <li>Grey italic columns (ID, Weighted, Tax, Total, Balance) are <b>auto-calculated</b>.</li>
            <li>Click any cell to edit inline; use <b>+ Add</b> to create a row.</li>
            <li>Each table has its own search and <b>CSV export</b>.</li>
            <li>Back up everything with <b>Export backup</b> (sidebar) → a JSON file.</li>
            <li>Set your <b>Annual Goal</b> on the Income tab; targets split monthly.</li>
          </ul>
        </div>
      </div>

      <div className="card pad" style={{ marginTop: 16 }}>
        <div className="card-title">Data</div>
        <p className="muted" style={{ marginTop: 0 }}>
          Your data lives only in this browser's local storage. Export a backup regularly. These actions affect all modules.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button onClick={() => { if (confirm('Load the sample data set? This replaces your current data.')) store.loadSample() }}>Load sample data</Button>
          <button className="btn danger" onClick={() => { if (confirm('Erase ALL data and start empty? This cannot be undone.')) store.clearAll() }}>
            Clear all data
          </button>
        </div>
      </div>
    </>
  )
}
