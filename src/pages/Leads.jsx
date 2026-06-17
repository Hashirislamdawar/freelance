import { PageHeader } from '../components/ui'
import DataTable from '../components/DataTable'
import { useCurrency } from '../store'
import { LEAD_STATUSES, PRIORITIES, SOURCES, SERVICES, WIN_PCTS, OWNERS, STATUS_COLORS, PRIORITY_COLORS } from '../constants'
import { leadWeighted, isOverdue } from '../utils'

const columns = [
  { key: '_id', label: 'ID', type: 'code', prefix: 'LD-' },
  { key: 'company', label: 'Company', type: 'text', placeholder: 'Company name', width: 170 },
  { key: 'contact', label: 'Contact', type: 'text', width: 130 },
  { key: 'service', label: 'Service', type: 'select', options: SERVICES, width: 150 },
  { key: 'source', label: 'Source', type: 'select', options: SOURCES, width: 130 },
  { key: 'status', label: 'Status', type: 'badge', options: LEAD_STATUSES, colors: STATUS_COLORS },
  { key: 'priority', label: 'Priority', type: 'badge', options: PRIORITIES, colors: PRIORITY_COLORS },
  { key: 'dealValue', label: 'Deal Value', type: 'money', width: 100 },
  { key: 'winPct', label: 'Win %', type: 'percent', width: 70 },
  { key: 'weighted', label: 'Weighted', type: 'computedMoney', compute: leadWeighted, width: 100 },
  { key: 'nextFollowUp', label: 'Next Follow-up', type: 'date', width: 140 },
  { key: 'owner', label: 'Owner', type: 'select', options: OWNERS, width: 100 },
  { key: 'notes', label: 'Notes', type: 'text', width: 220 },
]

export default function Leads() {
  const cur = useCurrency()
  return (
    <>
      <PageHeader title="Leads — Sales Pipeline" subtitle="Your CRM. Weighted value is auto-calculated; overdue follow-ups are highlighted." />
      <DataTable
        collection="leads"
        columns={columns}
        currency={cur}
        newLabel="Add lead"
        defaults={() => ({ status: 'To Contact', priority: 'Medium', owner: 'You', winPct: 25 })}
        rowFlag={(r) => isOverdue(r.nextFollowUp, r.status === 'Won' || r.status === 'Lost')}
      />
    </>
  )
}
