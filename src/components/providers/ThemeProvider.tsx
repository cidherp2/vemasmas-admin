import { useLayoutEffect, useState } from 'react'

import { ThemeContext, type Theme } from '@/context/theme-context'

const themeStorageKey = 'vemasmas-admin-theme'

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(themeStorageKey)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  const toggleTheme = (): void => setTheme((current) => (current === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}