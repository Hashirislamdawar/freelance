import { MONTHS, LEAD_STATUSES, SOURCES, PROJECT_STATUSES, INVOICE_STATUSES } from './constants'
import { num, sum, invoiceTotal, leadWeighted } from './utils'

export function deriveMonthly(data) {
  const year = new Date().getFullYear()
  const goal = num(data.settings?.annualGoal)
  const target = goal / 12
  const months = MONTHS.map((m) => ({ month: m, revenue: 0, target }))

  data.invoices.forEach((inv) => {
    if (inv.status === 'Paid' && inv.datePaid) {
      const d = new Date(inv.datePaid)
      if (d.getFullYear() === year) months[d.getMonth()].revenue += invoiceTotal(inv)
    }
  })

  const now = new Date()
  const elapsed = now.getFullYear() === year ? now.getMonth() + 1 : 12
  const ytd = sum(months.map((m) => m.revenue))
  const avg = elapsed ? ytd / elapsed : 0

  let cum = 0
  let cumT = 0
  months.forEach((m, i) => {
    cum += m.revenue
    cumT += m.target
    m.cumulative = cum
    m.cumTarget = cumT
    m.actual = m.revenue
    m.forecast = i < elapsed ? m.revenue : Math.round(avg)
  })
  const forecastTotal = sum(months.map((m) => m.forecast))
  return { months, ytd, goal, target, elapsed, avg, forecastTotal }
}

export function deriveKpis(data) {
  const { leads, invoices, projects } = data
  const monthly = deriveMonthly(data)

  const won = leads.filter((l) => l.status === 'Won')
  const lost = leads.filter((l) => l.status === 'Lost')
  const paidTotal = sum(invoices.filter((i) => i.status === 'Paid').map(invoiceTotal))
  const outstanding = sum(invoices.filter((i) => ['Sent', 'Overdue'].includes(i.status)).map(invoiceTotal))
  const billed = paidTotal + outstanding

  const thisM = monthly.months[Math.min(monthly.elapsed - 1, 11)]?.revenue ?? 0
  const lastM = monthly.months[Math.min(monthly.elapsed - 2, 11)]?.revenue ?? 0

  const completed = projects.filter((p) => p.status === 'Completed').length

  return {
    revenueYTD: monthly.ytd,
    goalPct: monthly.goal ? monthly.ytd / monthly.goal : 0,
    outstanding,
    unpaidCount: invoices.filter((i) => ['Sent', 'Overdue'].includes(i.status)).length,
    activeProjects: projects.filter((p) => !['Completed', 'On Hold'].includes(p.status)).length,
    completedProjects: completed,
    totalProjects: projects.length,
    totalLeads: leads.length,
    openLeads: leads.filter((l) => !['Won', 'Lost', 'No Response'].includes(l.status)).length,
    weightedPipeline: sum(leads.filter((l) => !['Won', 'Lost', 'No Response'].includes(l.status)).map(leadWeighted)),
    winRate: won.length + lost.length ? won.length / (won.length + lost.length) : 0,
    wonCount: won.length,
    lostCount: lost.length,
    avgDeal: won.length ? sum(won.map((l) => num(l.dealValue))) / won.length : 0,
    collectionRate: billed ? paidTotal / billed : 0,
    collected: paidTotal,
    monthlyGrowth: lastM ? (thisM - lastM) / lastM : 0,
    projectCompletion: projects.length ? completed / projects.length : 0,
    forecastTotal: monthly.forecastTotal,
    avgMonthly: monthly.avg,
  }
}

const countBy = (rows, key, value) => rows.filter((r) => r[key] === value).length

export function leadsByStage(data) {
  return LEAD_STATUSES.map((s) => ({ name: s, value: countBy(data.leads, 'status', s) }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
}

export function leadsBySource(data) {
  return SOURCES.map((s) => ({ name: s, value: countBy(data.leads, 'source', s) })).filter((d) => d.value > 0)
}

export function projectStatusData(data) {
  return PROJECT_STATUSES.map((s) => ({ name: s, value: countBy(data.projects, 'status', s) })).filter((d) => d.value > 0)
}

export function invoiceStatusData(data) {
  return INVOICE_STATUSES.map((s) => ({
    name: s,
    value: sum(data.invoices.filter((i) => i.status === s).map(invoiceTotal)),
  })).filter((d) => d.value > 0)
}

export function expenseByCategory(data) {
  const map = {}
  data.expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + num(e.amount)
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function analyticsMonthly(data) {
  const monthly = deriveMonthly(data)
  const year = new Date().getFullYear()
  return monthly.months.map((m, i) => {
    const exp = sum(
      data.expenses
        .filter((e) => {
          if (!e.date) return false
          const d = new Date(e.date)
          return d.getFullYear() === year && d.getMonth() === i
        })
        .map((e) => num(e.amount))
    )
    return { month: m.month, revenue: m.revenue, expenses: exp, net: m.revenue - exp }
  })
}
