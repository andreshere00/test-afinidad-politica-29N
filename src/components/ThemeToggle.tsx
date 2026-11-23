import { Monitor, Moon, Sun } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTheme, type Theme } from "@/lib/theme"

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Tema claro", Icon: Sun },
  { value: "dark", label: "Tema oscuro", Icon: Moon },
  { value: "system", label: "Tema del sistema", Icon: Monitor },
]

/** Selector de tema: claro, oscuro o el del sistema. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      spacing={0}
      value={theme}
      onValueChange={(v) => v && setTheme(v as Theme)}
      aria-label="Tema de color"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
          <Icon aria-hidden />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
