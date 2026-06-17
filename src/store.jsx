import { createContext, useContext, useEffect, useState } from 'react'
import { seedData, emptyData } from './constants'
import { symbolFor } from './utils'

const KEY = 'freelance-os-data-v1'
const StoreContext = createContext(null)

const uid = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...emptyData(), ...parsed, settings: { ...emptyData().settings, ...(parsed.settings || {}) } }
    }
  } catch (e) {
    console.warn('Failed to load saved data', e)
  }
  return seedData()
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to persist', e)
    }
  }, [data])

  const api = {
    data,
    add: (coll, item = {}) => setData((d) => ({ ...d, [coll]: [...d[coll], { id: uid(), ...item }] })),
    update: (coll, id, patch) =>
      setData((d) => ({ ...d, [coll]: d[coll].map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
    remove: (coll, id) => setData((d) => ({ ...d, [coll]: d[coll].filter((r) => r.id !== id) })),
    setSettings: (patch) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
    importData: (obj) => setData({ ...emptyData(), ...obj }),
    loadSample: () => setData(seedData()),
    clearAll: () => setData(emptyData()),
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)

export function useCurrency() {
  const { data } = useContext(StoreContext)
  return symbolFor(data.settings.currency)
}
