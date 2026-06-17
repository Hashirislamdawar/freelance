import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { Icon, Svg } from './ui'
import { fmtMoney, num, toCsv, download } from '../utils'

export default function DataTable({ collection, columns, rowFlag, newLabel = 'Add row', defaults = () => ({}), currency = '$', rowActions = [] }) {
  const store = useStore()
  const rows = store.data[collection]
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return rows
    const term = q.toLowerCase()
    return rows.filter((r) => columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(term)))
  }, [rows, q, columns])

  const set = (id, key, value) => store.update(collection, id, { [key]: value })
  const setNum = (id, key, value) => store.update(collection, id, { [key]: value === '' ? '' : num(value) })

  function exportCsv() {
    download(`${collection}.csv`, toCsv(rows, columns), 'text/csv')
  }

  function cell(col, row, idx) {
    const v = row[col.key]
    switch (col.type) {
      case 'code':
        return <span className="cell-code">{col.prefix}{String(idx + 1).padStart(3, '0')}</span>
      case 'computed':
        return <span className="cell-computed">{col.compute(row, idx)}</span>
      case 'computedMoney':
        return <span className="cell-computed cell-money">{fmtMoney(col.compute(row, idx), currency)}</span>
      case 'badge': {
        const c = col.colors?.[v] || { bg: '#f1f5f9', fg: '#475569' }
        return (
          <select className="badge-select" style={{ background: c.bg, color: c.fg }} value={v || ''} onChange={(e) => set(row.id, col.key, e.target.value)}>
            <option value="">—</option>
            {col.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )
      }
      case 'select':
        return (
          <select className="cell-input" value={v || ''} onChange={(e) => set(row.id, col.key, e.target.value)}>
            <option value="">—</option>
            {col.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )
      case 'progress':
        return (
          <div className="dt-progress">
            <div className="bar"><i style={{ width: `${Math.max(0, Math.min(100, num(v)))}%` }} /></div>
            <input className="cell-input" style={{ width: 52, minWidth: 0 }} type="number" min="0" max="100" value={v ?? ''} onChange={(e) => setNum(row.id, col.key, e.target.value)} />
          </div>
        )
      case 'money':
      case 'number':
      case 'percent':
        return <input className="cell-input" type="number" value={v ?? ''} placeholder="0" onChange={(e) => setNum(row.id, col.key, e.target.value)} />
      case 'date':
        return <input className="cell-input" type="date" value={v || ''} onChange={(e) => set(row.id, col.key, e.target.value)} />
      default:
        return <input className="cell-input" type="text" value={v || ''} placeholder={col.placeholder || ''} onChange={(e) => set(row.id, col.key, e.target.value)} />
    }
  }

  return (
    <div>
      <div className="table-toolbar">
        <div className="search">
          <Svg d={Icon.search} />
          <input placeholder={`Search ${collection}…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn sm" onClick={exportCsv}><Svg d={Icon.download} /> CSV</button>
          <button className="btn sm primary" onClick={() => store.add(collection, defaults())}><Svg d={Icon.plus} /> {newLabel}</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table className="dt">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={c.width ? { width: c.width, minWidth: c.width } : undefined}>{c.label}</th>
                ))}
                <th style={{ width: 44 + rowActions.length * 32 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const realIdx = rows.indexOf(row)
                return (
                  <tr key={row.id} className={rowFlag?.(row) ? 'flag' : ''}>
                    {columns.map((c) => (
                      <td key={c.key} className={c.type === 'money' || c.type === 'number' ? 'cell-money' : ''}>
                        {cell(c, row, realIdx)}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        {rowActions.map((a) => (
                          <button key={a.title} className="row-act" title={a.title} onClick={() => a.onClick(row, realIdx)}>
                            <Svg d={a.icon} />
                          </button>
                        ))}
                        <button className="row-del" title="Delete" onClick={() => store.remove(collection, row.id)}>
                          <Svg d={Icon.trash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="empty"><div className="big">✨</div>{q ? 'No matches.' : `No ${collection} yet — click "${newLabel}".`}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
