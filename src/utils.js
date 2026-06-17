import { CURRENCIES } from './constants'

export const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export function symbolFor(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? (code || '$')
}

export const sum = (arr) => arr.reduce((s, x) => s + num(x), 0)

export function fmtMoney(v, currency = '$') {
  const n = Math.round(num(v))
  if (n === 0) return '—'
  const s = Math.abs(n).toLocaleString('en-US')
  return n < 0 ? `(${currency}${s})` : `${currency}${s}`
}

export const fmtMoneyPlain = (v, currency = '$') =>
  `${currency}${Math.round(num(v)).toLocaleString('en-US')}`

export const fmtPct = (frac) => `${(num(frac) * 100).toFixed(1)}%`

export function fmtDate(s) {
  if (!s) return ''
  return s
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

// row-level derived values
export const leadWeighted = (l) => (num(l.dealValue) * num(l.winPct)) / 100
export const invoiceTax = (i) => (num(i.amount) * num(i.taxPct)) / 100
export const invoiceTotal = (i) => num(i.amount) + invoiceTax(i)
export const projectBalance = (p) => num(p.amount) - num(p.received)

export function isOverdue(dateStr, done) {
  if (!dateStr || done) return false
  return new Date(dateStr) < new Date(todayISO())
}

// CSV export
export function toCsv(rows, columns) {
  const head = columns.map((c) => `"${c.label}"`).join(',')
  const body = rows
    .map((r, i) =>
      columns
        .map((c) => {
          const raw = c.compute ? c.compute(r, i) : r[c.key]
          return `"${String(raw ?? '').replace(/"/g, '""')}"`
        })
        .join(',')
    )
    .join('\n')
  return `${head}\n${body}`
}

export function download(filename, text, type = 'text/plain') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
