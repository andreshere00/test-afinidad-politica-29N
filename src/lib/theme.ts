import { useCallback, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

/** Clave en localStorage; el script de index.html la lee antes de pintar para evitar parpadeos. */
export const THEME_KEY = "theme"

const media = () => window.matchMedia("(prefers-color-scheme: dark)")

function readTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === "light" || t === "dark") return t
  } catch {
    // Sin acceso a localStorage (modo privado, cookies bloqueadas): se usa el del sistema.
  }
  return "system"
}

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && media().matches)
  document.documentElement.classList.toggle("dark", dark)
}

/** Tema elegido (claro, oscuro o el del sistema), guardado en este navegador. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme)

  useEffect(() => {
    apply(theme)
    if (theme !== "system") return
    // Con «sistema», seguir los cambios del sistema operativo en vivo.
    const mq = media()
    const onChange = () => apply("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    try {
      if (t === "system") localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, t)
    } catch {
      // Se aplica igualmente, aunque no se recuerde.
    }
    setThemeState(t)
  }, [])

  return { theme, setTheme }
}
