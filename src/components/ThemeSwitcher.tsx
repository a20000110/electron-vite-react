import React from 'react'
import { useThemeStore, THEMES, type Theme } from '@/store/theme'

const SWATCH_HSL: Record<Theme, string> = {
  black: 'hsl(0 0% 0%)',
  pink: 'hsl(330 100% 71%)',
  orange: 'hsl(33 100% 50%)',
  green: 'hsl(120 100% 25%)',
  blue: 'hsl(211 100% 50%)',
}

export default function ThemeSwitcher(): JSX.Element {
  const theme = useThemeStore(s => s.theme)
  const setTheme = useThemeStore(s => s.setTheme)

  return (
    <div className="flex gap-2 p-3">
      {THEMES.map(t => (
        <button
          key={t}
          type="button"
          aria-label={`switch-to-${t}`}
          onClick={() => setTheme(t)}
          className={`h-8 w-8 rounded-full border border-color-primary ${theme === t ? 'ring-2 ring' : ''}`}
          style={{ backgroundColor: SWATCH_HSL[t] }}
        />
      ))}
    </div>
  )
}