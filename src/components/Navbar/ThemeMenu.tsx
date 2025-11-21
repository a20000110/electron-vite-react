import RemixIcon from '@/components/RemixIcon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { THEMES, useThemeStore, type Theme } from '@/store/theme'

const SWATCH_HSL: Record<Theme, string> = {
  black: 'hsl(0 0% 0%)',
  pink: 'hsl(330 100% 71%)',
  orange: 'hsl(33 100% 50%)',
  green: 'hsl(120 100% 25%)',
  blue: 'hsl(211 100% 50%)',
  night: 'hsl(0 0% 7%)',
}

export default function ThemeMenu(): JSX.Element {
  const theme = useThemeStore(s => s.theme)
  const setTheme = useThemeStore(s => s.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer hover:border-color-primary"
          aria-label="theme-switcher"
        >
          <RemixIcon name="palette-fill" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-schema text-foreground border border-border min-w-40">
        <DropdownMenuLabel className="text-sm">选择主题</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={v => setTheme(v as Theme)}>
          {THEMES.map(t => (
            <DropdownMenuRadioItem
              key={t}
              value={t}
              className="gap-2 hover:bg-subtle data-[state=checked]:bg-subtle cursor-pointer"
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: SWATCH_HSL[t] }}
              />
              <span className="capitalize">{t}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
