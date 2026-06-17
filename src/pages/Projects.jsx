import { PageHeader } from '../components/ui'
import DataTable from '../components/DataTable'
import { useCurrency } from '../store'
import { PROJECT_STATUSES, SERVICES, PROJECT_COLORS } from '../constants'
import { projectBalance, isOverdue } from '../utils'

const columns = [
  { key: '_id', label: 'ID', type: 'code', prefix: 'PR-' },
  { key: 'name', label: 'Project / Job', type: 'text', placeholder: 'Project name', width: 190 },
  { key: 'client', label: 'Client', type: 'text', width: 150 },
  { key: 'service', label: 'Service', type: 'select', options: SERVICES, width: 150 },
  { key: 'start', label: 'Start', type: 'date', width: 130 },
  { key: 'deadline', label: 'Deadline', type: 'date', width: 130 },
  { key: 'status', label: 'Status', type: 'badge', options: PROJECT_STATUSES, colors: PROJECT_COLORS },
  { key: 'progress', label: 'Progress', type: 'progress', width: 140 },
  { key: 'amount', label: 'Amount', type: 'money', width: 100 },
  { key: 'received', label: 'Received', type: 'money', width: 100 },
  { key: 'balance', label: 'Balance', type: 'computedMoney', compute: projectBalance, width: 100 },
  { key: 'notes', label: 'Notes', type: 'text', width: 200 },
]

export default function Projects() {
  const cur = useCurrency()
  return (
    <>
      <PageHeader title="Projects — Active Work" subtitle="Jobs you've won. Progress bars and overdue deadlines update live." />
      <DataTable
        collection="projects"
        columns={columns}
        currency={cur}
        newLabel="Add project"
        defaults={() => ({ status: 'Not Started', progress: 0 })}
        rowFlag={(r) => isOverdue(r.deadline, r.status === 'Completed')}
      />
    </>
  )
}
