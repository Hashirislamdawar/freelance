import { PageHeader } from '../components/ui'
import DataTable from '../components/DataTable'
import { useStore, useCurrency } from '../store'
import { EXPENSE_CATEGORIES, RECURRING } from '../constants'
import { deriveKpis, expenseByCategory } from '../selectors'
import { fmtMoney, fmtPct, num, sum } from '../utils'

const columns = [
  { key: '_id', label: 'ID', type: 'code', prefix: 'EX-' },
  { key: 'date', label: 'Date', type: 'date', width: 130 },
  { key: 'category', label: 'Category', type: 'select', options: EXPENSE_CATEGORIES, width: 150 },
  { key: 'vendor', label: 'Vendor / Description', type: 'text', placeholder: 'What was it for?', width: 230 },
  { key: 'amount', label: 'Amount', type: 'money', width: 110 },
  { key: 'recurring', label: 'Recurring', type: 'select', options: RECURRING, width: 110 },
  { key: 'notes', label: 'Notes', type: 'text', width: 200 },
]

export default function Expenses() {
  const store = useStore()
  const cur = useCurrency()
  const k = deriveKpis(store.data)
  const totalExpenses = sum(store.data.expenses.map((e) => num(e.amount)))
  const net = k.revenueYTD - totalExpenses
  const margin = k.revenueYTD ? net / k.revenueYTD : 0
  const byCat = expenseByCategory(store.data)

  return (
    <>
      <PageHeader title="Expenses — Costs & Net Profit" subtitle="Log every cost. Net profit and margin update automatically." />
      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="card pad">
          <div className="card-sub">Total Expenses</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginTop: 6 }}>{fmtMoney(totalExpenses, cur)}</div>
        </div>
        <div className="card pad">
          <div className="card-sub">Net Profit (YTD)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: net >= 0 ? 'var(--emerald)' : 'var(--red)', marginTop: 6 }}>{fmtMoney(net, cur)}</div>
        </div>
        <div className="card pad">
          <div className="card-sub">Profit Margin</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginTop: 6 }}>{fmtPct(margin)}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <div className="card pad">
          <div className="card-title">By category</div>
          {byCat.length === 0 && <div className="muted">No expenses logged yet.</div>}
          {byCat.map((c) => (
            <div className="stat-row" key={c.name}>
              <span className="lbl">{c.name}</span>
              <span className="val">{fmtMoney(c.value, cur)}</span>
            </div>
          ))}
        </div>
        <div className="card pad">
          <div className="card-title">Profit snapshot</div>
          <div className="stat-row"><span className="lbl">Revenue (YTD)</span><span className="val">{fmtMoney(k.revenueYTD, cur)}</span></div>
          <div className="stat-row"><span className="lbl">Expenses (YTD)</span><span className="val">{fmtMoney(totalExpenses, cur)}</span></div>
          <div className="stat-row"><span className="lbl">Net Profit</span><span className="val" style={{ color: net >= 0 ? 'var(--emerald)' : 'var(--red)' }}>{fmtMoney(net, cur)}</span></div>
        </div>
      </div>

      <DataTable
        collection="expenses"
        columns={columns}
        currency={cur}
        newLabel="Add expense"
        defaults={() => ({ category: 'Software', recurring: 'No', date: new Date().toISOString().slice(0, 10) })}
      />
    </>
  )
}
