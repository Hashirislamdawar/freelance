import { PageHeader } from '../components/ui'
import { Icon } from '../components/ui'
import DataTable from '../components/DataTable'
import { useStore, useCurrency } from '../store'
import { INVOICE_STATUSES, PAYMENT_METHODS, INVOICE_COLORS } from '../constants'
import { invoiceTax, invoiceTotal, isOverdue } from '../utils'

const columns = [
  { key: '_id', label: 'ID', type: 'code', prefix: 'IN-' },
  { key: 'client', label: 'Client', type: 'text', placeholder: 'Client', width: 150 },
  { key: 'description', label: 'Description', type: 'text', width: 200 },
  { key: 'issueDate', label: 'Issue Date', type: 'date', width: 130 },
  { key: 'dueDate', label: 'Due Date', type: 'date', width: 130 },
  { key: 'amount', label: 'Amount', type: 'money', width: 100 },
  { key: 'taxPct', label: 'Tax %', type: 'percent', width: 70 },
  { key: 'tax', label: 'Tax', type: 'computedMoney', compute: invoiceTax, width: 90 },
  { key: 'total', label: 'Total', type: 'computedMoney', compute: invoiceTotal, width: 100 },
  { key: 'status', label: 'Status', type: 'badge', options: INVOICE_STATUSES, colors: INVOICE_COLORS },
  { key: 'datePaid', label: 'Date Paid', type: 'date', width: 130 },
  { key: 'method', label: 'Method', type: 'select', options: PAYMENT_METHODS, width: 130 },
  { key: 'notes', label: 'Notes', type: 'text', width: 180 },
]

export default function Invoices() {
  const store = useStore()
  const cur = useCurrency()

  return (
    <>
      <PageHeader
        title="Invoices — Billing & Collection"
        subtitle="Tax & Total auto-calculate. Click the PDF icon to download a branded invoice. Overdue rows flag red."
      />
      <DataTable
        collection="invoices"
        columns={columns}
        currency={cur}
        newLabel="Add invoice"
        defaults={() => ({ status: 'Draft', taxPct: 0 })}
        rowFlag={(r) => isOverdue(r.dueDate, r.status === 'Paid' || r.status === 'Draft')}
        rowActions={[
          {
            icon: Icon.pdf,
            title: 'Download PDF',
            onClick: (row, idx) =>
              import('../pdf').then((m) =>
                m.generateInvoicePdf(row, store.data.settings, `IN-${String(idx + 1).padStart(3, '0')}`)
              ),
          },
        ]}
      />
    </>
  )
}
