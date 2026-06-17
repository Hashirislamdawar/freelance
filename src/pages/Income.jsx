import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { PageHeader } from '../components/ui'
import { useStore, useCurrency } from '../store'
import { deriveMonthly } from '../selectors'
import { fmtMoney, fmtMoneyPlain, fmtPct, num } from '../utils'

export default function Income() {
  const store = useStore()
  const cur = useCurrency()
  const m = deriveMonthly(store.data)
  const goalPct = m.goal ? m.ytd / m.goal : 0

  const kpis = [
    { label: 'Annual Goal', el: (
      <input
        className="cell-input"
        style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', padding: 0, width: '100%' }}
        type="number"
        value={store.data.settings.annualGoal ?? ''}
        onChange={(e) => store.setSettings({ annualGoal: e.target.value === '' ? '' : num(e.target.value) })}
      />
    ) },
    { label: 'YTD Actual', value: fmtMoney(m.ytd, cur), color: 'var(--emerald)' },
    { label: '% to Goal', value: fmtPct(goalPct), color: 'var(--primary)' },
    { label: 'Forecast Year-End', value: fmtMoney(m.forecastTotal, cur), color: 'var(--indigo)' },
  ]

  return (
    <>
      <PageHeader title="Income — Goals & Forecast" subtitle="Revenue is pulled automatically from paid invoices. Set your annual goal below." />

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 18 }}>
        {kpis.map((k) => (
          <div className="card pad" key={k.label}>
            <div className="card-sub">{k.label}</div>
            {k.el ? k.el : <div style={{ fontSize: 24, fontWeight: 800, color: k.color, marginTop: 6 }}>{k.value}</div>}
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom: 18 }}>
        <h3>Monthly revenue vs target</h3>
        <p className="ch-sub">Bars = actual income · line = monthly target</p>
        <div className="chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer>
            <ComposedChart data={m.months} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => fmtMoneyPlain(v, cur)} width={70} />
              <Tooltip formatter={(v) => fmtMoneyPlain(v, cur)} />
              <Legend />
              <Bar dataKey="revenue" name="Actual" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={34} />
              <Line dataKey="target" name="Target" stroke="#d97706" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="dt">
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign: 'right' }}>Target</th>
                <th style={{ textAlign: 'right' }}>Actual</th>
                <th style={{ textAlign: 'right' }}>Gap</th>
                <th style={{ textAlign: 'right' }}>Cumulative</th>
                <th style={{ textAlign: 'right' }}>Forecast</th>
              </tr>
            </thead>
            <tbody>
              {m.months.map((row) => {
                const gap = row.revenue - row.target
                return (
                  <tr key={row.month}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.month}</td>
                    <td className="cell-money" style={{ padding: '10px 12px' }}>{fmtMoney(row.target, cur)}</td>
                    <td className="cell-money" style={{ padding: '10px 12px', fontWeight: 700 }}>{fmtMoney(row.revenue, cur)}</td>
                    <td className="cell-money" style={{ padding: '10px 12px', color: gap >= 0 ? 'var(--emerald)' : 'var(--red)', fontWeight: 600 }}>{fmtMoney(gap, cur)}</td>
                    <td className="cell-money" style={{ padding: '10px 12px' }}>{fmtMoney(row.cumulative, cur)}</td>
                    <td className="cell-money" style={{ padding: '10px 12px', color: 'var(--muted)' }}>{fmtMoney(row.forecast, cur)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                <td style={{ padding: '12px' }}>Total</td>
                <td className="cell-money" style={{ padding: '12px' }}>{fmtMoney(m.goal, cur)}</td>
                <td className="cell-money" style={{ padding: '12px' }}>{fmtMoney(m.ytd, cur)}</td>
                <td className="cell-money" style={{ padding: '12px' }}>{fmtMoney(m.ytd - m.goal, cur)}</td>
                <td className="cell-money" style={{ padding: '12px' }}>{fmtMoney(m.ytd, cur)}</td>
                <td className="cell-money" style={{ padding: '12px' }}>{fmtMoney(m.forecastTotal, cur)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}
