import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  LineChart, Line, PieChart, Pie, ComposedChart, Legend,
} from 'recharts'
import { PageHeader, Kpi, ChartCard } from '../components/ui'
import { useStore, useCurrency } from '../store'
import {
  deriveKpis, deriveMonthly, leadsByStage, leadsBySource,
  projectStatusData, invoiceStatusData,
} from '../selectors'
import { fmtMoney, fmtMoneyPlain, fmtPct } from '../utils'
import { CHART_COLORS, INVOICE_COLORS, PROJECT_COLORS } from '../constants'

const axis = { tickLine: false, axisLine: false, fontSize: 12, stroke: '#94a3b8' }

export default function Dashboard() {
  const store = useStore()
  const d = store.data
  const cur = useCurrency()
  const k = deriveKpis(d)
  const m = deriveMonthly(d)
  const stages = leadsByStage(d)
  const sources = leadsBySource(d)
  const projStat = projectStatusData(d)
  const invStat = invoiceStatusData(d)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
  const money = (v) => fmtMoneyPlain(v, cur)

  return (
    <>
      <PageHeader title="Freelance Business OS" subtitle="Executive overview — every metric updates automatically.">
        <span className="muted" style={{ fontWeight: 600 }}>{today}</span>
      </PageHeader>

      <div className="kpi-grid">
        <Kpi label="Revenue — YTD" accent="var(--emerald)" value={fmtMoney(k.revenueYTD, cur)} sub={`${(k.goalPct * 100).toFixed(0)}% of annual goal`} />
        <Kpi label="Outstanding" accent="var(--amber)" value={fmtMoney(k.outstanding, cur)} sub={`${k.unpaidCount} invoices unpaid`} />
        <Kpi label="Active Projects" accent="var(--primary2)" value={k.activeProjects} sub={`${k.completedProjects} completed`} />
        <Kpi label="Total Leads" accent="var(--slate)" value={k.totalLeads} sub={`${k.openLeads} open`} />
        <Kpi label="Weighted Pipeline" accent="var(--indigo)" value={fmtMoney(k.weightedPipeline, cur)} sub="probability-adjusted" />
        <Kpi label="Win Rate" accent="var(--emerald)" value={fmtPct(k.winRate)} sub={`${k.wonCount} won · ${k.lostCount} lost`} />
        <Kpi label="Avg Deal Size" accent="var(--slate)" value={fmtMoney(k.avgDeal, cur)} sub="across won deals" />
        <Kpi label="Collection Rate" accent="var(--emerald)" value={fmtPct(k.collectionRate)} sub={`${money(k.collected)} collected`} />
        <Kpi
          label="Monthly Growth"
          accent="var(--primary2)"
          value={
            <span style={{ color: k.monthlyGrowth >= 0 ? 'var(--emerald)' : 'var(--red)' }}>
              {k.monthlyGrowth >= 0 ? '▲' : '▼'} {fmtPct(Math.abs(k.monthlyGrowth))}
            </span>
          }
          sub="vs last month"
        />
        <Kpi label="Project Completion" accent="var(--primary)" value={fmtPct(k.projectCompletion)} sub={`${k.completedProjects} of ${k.totalProjects} projects`} />
      </div>

      <div className="section-title">Pipeline &amp; lead insights</div>
      <div className="chart-grid">
        <ChartCard title="Leads by stage" sub="sorted by volume">
          <ResponsiveContainer>
            <BarChart layout="vertical" data={stages} margin={{ top: 4, right: 18, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" {...axis} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axis} width={92} />
              <Tooltip />
              <Bar dataKey="value" name="Leads" fill="#2563eb" radius={[0, 6, 6, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead source breakdown" sub={`${k.totalLeads} leads total`}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={sources} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={2}>
                {sources.map((s, i) => (
                  <Cell key={s.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="section-title">Revenue performance</div>
      <div className="chart-grid">
        <ChartCard title="Monthly revenue">
          <ResponsiveContainer>
            <BarChart data={m.months} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue trend" sub="cumulative">
          <ResponsiveContainer>
            <LineChart data={m.months} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Line dataKey="cumulative" name="Cumulative" stroke="#1e3a8a" strokeWidth={2.5} dot={false} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="section-title">Operations</div>
      <div className="chart-grid">
        <ChartCard title="Invoice status" sub="by amount">
          <ResponsiveContainer>
            <BarChart data={invStat} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {invStat.map((s) => (
                  <Cell key={s.name} fill={INVOICE_COLORS[s.name]?.fg || '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Project status" sub="by count">
          <ResponsiveContainer>
            <BarChart data={projStat} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} allowDecimals={false} width={32} />
              <Tooltip />
              <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {projStat.map((s) => (
                  <Cell key={s.name} fill={PROJECT_COLORS[s.name]?.fg || '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="section-title">Goals &amp; forecasting</div>
      <div className="chart-grid">
        <ChartCard title="Goal vs actual">
          <ResponsiveContainer>
            <ComposedChart data={m.months} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Legend />
              <Bar dataKey="revenue" name="Actual" fill="#2563eb" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Line dataKey="target" name="Target" stroke="#d97706" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue forecast" sub="actual vs projected run-rate">
          <ResponsiveContainer>
            <ComposedChart data={m.months} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={money} width={64} />
              <Tooltip formatter={money} />
              <Legend />
              <Bar dataKey="revenue" name="Actual" fill="#059669" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Line dataKey="forecast" name="Forecast" stroke="#4338ca" strokeWidth={2} strokeDasharray="5 4" dot={false} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}
