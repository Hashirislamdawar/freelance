import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts'
import { PageHeader, ChartCard } from '../components/ui'
import { useStore, useCurrency } from '../store'
import { deriveKpis, analyticsMonthly } from '../selectors'
import { fmtMoney, fmtMoneyPlain, fmtPct, num, sum } from '../utils'

const axis = { tickLine: false, axisLine: false, fontSize: 12, stroke: '#94a3b8' }

function Metric({ label, value }) {
  return (
    <div className="stat-row">
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
    </div>
  )
}

export default function Analytics() {
  const store = useStore()
  const d = store.data
  const cur = useCurrency()
  const k = deriveKpis(d)
  const monthly = analyticsMonthly(d)
  const money = (v) => fmtMoneyPlain(v, cur)

  const totalExpenses = sum(d.expenses.map((e) => num(e.amount)))
  const netProfit = k.revenueYTD - totalExpenses
  const totalInvoiced = sum(d.invoices.map((i) => num(i.amount) + (num(i.amount) * num(i.taxPct)) / 100))
  const avgProject = d.projects.length ? sum(d.projects.map((p) => num(p.amount))) / d.projects.length : 0
  const clients = new Set(d.invoices.map((i) => (i.client || '').trim()).filter(Boolean))
  const clv = clients.size ? k.collected / clients.size : 0

  return (
    <>
      <PageHeader title="Analytics — Business Intelligence" subtitle="Conversion, deal economics, profitability and forecasting." />

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="card pad">
          <div className="card-title">Pipeline</div>
          <Metric label="Total Leads" value={k.totalLeads} />
          <Metric label="Conversion (Won)" value={fmtPct(k.totalLeads ? k.wonCount / k.totalLeads : 0)} />
          <Metric label="Win Rate" value={fmtPct(k.winRate)} />
          <Metric label="Avg Deal Size" value={fmtMoney(k.avgDeal, cur)} />
          <Metric label="Weighted Pipeline" value={fmtMoney(k.weightedPipeline, cur)} />
        </div>
        <div className="card pad">
          <div className="card-title">Delivery</div>
          <Metric label="Total Projects" value={k.totalProjects} />
          <Metric label="Completed" value={k.completedProjects} />
          <Metric label="Completion Rate" value={fmtPct(k.projectCompletion)} />
          <Metric label="Avg Project Value" value={fmtMoney(avgProject, cur)} />
          <Metric label="Active Clients" value={clients.size} />
        </div>
        <div className="card pad">
          <div className="card-title">Cash &amp; profit</div>
          <Metric label="Total Invoiced" value={fmtMoney(totalInvoiced, cur)} />
          <Metric label="Collected" value={fmtMoney(k.collected, cur)} />
          <Metric label="Outstanding" value={fmtMoney(k.outstanding, cur)} />
          <Metric label="Collection Rate" value={fmtPct(k.collectionRate)} />
          <Metric label="Net Profit (YTD)" value={fmtMoney(netProfit, cur)} />
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="card pad">
          <div className="card-sub">Avg Monthly Revenue</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--ink)', marginTop: 6 }}>{fmtMoney(k.avgMonthly, cur)}</div>
        </div>
        <div className="card pad">
          <div className="card-sub">Forecast Year-End</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--indigo)', marginTop: 6 }}>{fmtMoney(k.forecastTotal, cur)}</div>
        </div>
        <div className="card pad">
          <div className="card-sub">Client Lifetime Value (avg)</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--emerald)', marginTop: 6 }}>{fmtMoney(clv, cur)}</div>
        </div>
      </div>

      <div className="chart-grid">
        <ChartCard title="Revenue vs expenses" sub="monthly">
          <ResponsiveContainer>
            <BarChart data={monthly} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[5, 5, 0, 0]} maxBarSize={20} />
              <Bar dataKey="expenses" name="Expenses" fill="#dc2626" radius={[5, 5, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Net profit trend" sub="monthly">
          <ResponsiveContainer>
            <LineChart data={monthly} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Line dataKey="net" name="Net" stroke="#1e3a8a" strokeWidth={2.5} dot={false} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}
