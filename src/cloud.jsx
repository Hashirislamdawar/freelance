import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useStore } from './store'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const cloudConfigured = Boolean(url && key)
const supabase = cloudConfigured ? createClient(url, key) : null

const CloudContext = createContext(null)

async function upsertState(userId, data) {
  const { error } = await supabase
    .from('app_state')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() })
  if (error) throw error
}

export function CloudProvider({ children }) {
  const store = useStore()
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('idle') // idle | syncing | synced | error
  const [error, setError] = useState(null)
  const skipPush = useRef(false)
  const timer = useRef(null)

  // track auth session
  useEffect(() => {
    if (!cloudConfigured) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // on login → pull cloud (or seed cloud from local if empty)
  useEffect(() => {
    if (!cloudConfigured || !session) return undefined
    let cancelled = false
    ;(async () => {
      setStatus('syncing')
      try {
        const { data, error: e } = await supabase
          .from('app_state')
          .select('data')
          .eq('user_id', session.user.id)
          .maybeSingle()
        if (e) throw e
        if (cancelled) return
        if (data?.data) {
          skipPush.current = true
          store.importData(data.data)
        } else {
          await upsertState(session.user.id, store.data)
        }
        setStatus('synced')
        setError(null)
      } catch (err) {
        setStatus('error')
        setError(err.message)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  // on local change → debounced push
  useEffect(() => {
    if (!cloudConfigured || !session) return undefined
    if (skipPush.current) {
      skipPush.current = false
      return undefined
    }
    setStatus('syncing')
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        await upsertState(session.user.id, store.data)
        setStatus('synced')
        setError(null)
      } catch (err) {
        setStatus('error')
        setError(err.message)
      }
    }, 1200)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.data, session?.user?.id])

  const api = {
    configured: cloudConfigured,
    session,
    status,
    error,
    async signUp(email, password) {
      const { error: e } = await supabase.auth.signUp({ email, password })
      if (e) throw e
    },
    async signIn(email, password) {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) throw e
    },
    async signOut() {
      await supabase.auth.signOut()
    },
    async syncNow() {
      if (!session) return
      setStatus('syncing')
      try {
        await upsertState(session.user.id, store.data)
        setStatus('synced')
        setError(null)
      } catch (err) {
        setStatus('error')
        setError(err.message)
      }
    },
  }

  return <CloudContext.Provider value={api}>{children}</CloudContext.Provider>
}

export const useCloud = () => useContext(CloudContext)
