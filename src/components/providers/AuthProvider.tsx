import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { AuthContext, type AuthUser } from '@/context/auth-context'
import { AppError } from '@/lib/errors'
import { getCurrentSession, signInWithPassword, signOut, subscribeToAuthChanges } from '@/services/auth.service'
import { hasSupabaseConfig } from '@/services/supabase'

const fallbackStorageKey = 'vemasmas-admin-dev-session'
const isDevelopmentFallback = !hasSupabaseConfig && import.meta.env.DEV

function toAuthUser(user: User, simulated = false): AuthUser {
  return {
    id: user.id,
    email: user.email ?? 'usuario@local.test',
    displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Usuario',
    simulated,
  }
}

function getFallbackUser(): AuthUser | null {
  const stored = window.localStorage.getItem(fallbackStorageKey)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    window.localStorage.removeItem(fallbackStorageKey)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const initialFallbackUser = isDevelopmentFallback ? getFallbackUser() : null
  const [status, setStatus] = useState(() => {
    if (isDevelopmentFallback) return initialFallbackUser ? 'authenticated' as const : 'unauthenticated' as const
    return hasSupabaseConfig ? 'loading' as const : 'configuration-error' as const
  })
  const [user, setUser] = useState<AuthUser | null>(initialFallbackUser)

  useEffect(() => {
    let active = true
    if (isDevelopmentFallback || !hasSupabaseConfig) return () => undefined

    void getCurrentSession()
      .then((session) => {
        if (!active) return
        setUser(session?.user ? toAuthUser(session.user) : null)
        setStatus(session?.user ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => {
        if (active) setStatus('unauthenticated')
      })
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      if (!active) return
      setUser(nextUser ? toAuthUser(nextUser) : null)
      setStatus(nextUser ? 'authenticated' : 'unauthenticated')
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    if (isDevelopmentFallback) {
      if (password.length < 6) throw new AppError('AUTHENTICATION', 'El correo o la contraseña no son correctos.')
      const fallbackUser: AuthUser = { id: 'local-user', email, displayName: email.split('@')[0] ?? 'Usuario', simulated: true }
      window.localStorage.setItem(fallbackStorageKey, JSON.stringify(fallbackUser))
      setUser(fallbackUser)
      setStatus('authenticated')
      return
    }
    const nextUser = await signInWithPassword(email, password)
    setUser(toAuthUser(nextUser))
    setStatus('authenticated')
  }

  const handleSignOut = async (): Promise<void> => {
    if (isDevelopmentFallback) {
      window.localStorage.removeItem(fallbackStorageKey)
      setUser(null)
      setStatus('unauthenticated')
      return
    }
    await signOut()
    setUser(null)
    setStatus('unauthenticated')
  }

  return <AuthContext.Provider value={{ status, user, isDevelopmentFallback, signIn: handleSignIn, signOut: handleSignOut }}>{children}</AuthContext.Provider>
}