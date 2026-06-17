import { jsPDF } from 'jspdf'
import { num, symbolFor } from './utils'

const NAVY = [30, 58, 138]
const INK = [15, 23, 42]
const MUTED = [100, 116, 139]
const LINE = [226, 232, 240]

export function generateInvoicePdf(invoice, settings, number = 'INV-001') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const M = 48
  const sym = symbolFor(settings.currency)
  const money = (v) => `${sym}${num(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const amount = num(invoice.amount)
  const tax = (amount * num(invoice.taxPct)) / 100
  const total = amount + tax

  // header band
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 96, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(settings.businessName || 'Your Business', M, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (settings.businessEmail) doc.text(settings.businessEmail, M, 68)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.text('INVOICE', W - M, 56, { align: 'right' })

  // meta block
  let y = 132
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('BILL TO', M, y)
  doc.text('INVOICE #', W - M - 150, y)
  doc.text('ISSUE DATE', W - M - 150, y + 30)
  doc.text('DUE DATE', W - M - 150, y + 60)

  doc.setTextColor(...INK)
  doc.setFontSize(12)
  doc.text(invoice.client || '—', M, y + 18)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(number, W - M, y, { align: 'right' })
  doc.text(invoice.issueDate || '—', W - M, y + 30, { align: 'right' })
  doc.text(invoice.dueDate || '—', W - M, y + 60, { align: 'right' })

  if (settings.businessAddress) {
    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.text(doc.splitTextToSize(settings.businessAddress, 220), M, y + 36)
  }

  // table header
  y = 240
  doc.setFillColor(248, 250, 252)
  doc.rect(M, y, W - 2 * M, 26, 'F')
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DESCRIPTION', M + 12, y + 17)
  doc.text('AMOUNT', W - M - 230, y + 17, { align: 'right' })
  doc.text('TAX', W - M - 120, y + 17, { align: 'right' })
  doc.text('TOTAL', W - M - 12, y + 17, { align: 'right' })

  // line item
  y += 26
  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const desc = doc.splitTextToSize(invoice.description || 'Services rendered', 230)
  doc.text(desc, M + 12, y + 22)
  doc.text(money(amount), W - M - 230, y + 22, { align: 'right' })
  doc.text(money(tax), W - M - 120, y + 22, { align: 'right' })
  doc.text(money(total), W - M - 12, y + 22, { align: 'right' })
  y += 44
  doc.setDrawColor(...LINE)
  doc.line(M, y, W - M, y)

  // totals
  y += 26
  const lx = W - M - 200
  const rx = W - M - 12
  const totalRow = (label, val, bold) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...(bold ? INK : MUTED))
    doc.setFontSize(bold ? 13 : 11)
    doc.text(label, lx, y)
    doc.setTextColor(...INK)
    doc.text(val, rx, y, { align: 'right' })
    y += bold ? 26 : 20
  }
  totalRow('Subtotal', money(amount))
  totalRow(`Tax (${num(invoice.taxPct)}%)`, money(tax))
  doc.setDrawColor(...LINE)
  doc.line(lx, y - 8, rx, y - 8)
  totalRow('Total Due', money(total), true)

  // status pill
  doc.setFillColor(...(invoice.status === 'Paid' ? [16, 185, 129] : [217, 119, 6]))
  doc.roundedRect(M, y - 28, 78, 24, 12, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text((invoice.status || 'Draft').toUpperCase(), M + 39, y - 12, { align: 'center' })

  // notes / footer
  y += 24
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (invoice.notes) {
    doc.text(doc.splitTextToSize(`Notes: ${invoice.notes}`, W - 2 * M), M, y)
    y += 28
  }
  doc.text(doc.splitTextToSize(settings.paymentTerms || '', W - 2 * M), M, y)

  const safe = (s) => (s || 'invoice').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`${number}-${safe(invoice.client)}.pdf`)
}
