import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEMES = ['black', 'pink', 'orange', 'green', 'blue'] as const
export type Theme = (typeof THEMES)[number]

function applyTheme(theme: Theme) {
  const el = document.documentElement
  THEMES.forEach(t => el.classList.remove(t))
  el.classList.add(theme)
}

type ThemeState = {
  theme: Theme
  setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'black',
      setTheme: t => {
        set({ theme: t })
        applyTheme(t)
      },
    }),
    {
      name: 'app-theme',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        const current = state?.theme
        if (current) applyTheme(current as Theme)
      },
    }
  )
)
