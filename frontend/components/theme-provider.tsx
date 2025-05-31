"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextThemeHook } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import useStore from "@/store/useStore"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const storeSetTheme = useStore((state) => state.setTheme)
  const { resolvedTheme } = useNextThemeHook() // We might still need this to initialize Zustand

  // Effect to update Zustand store when next-themes resolved theme changes
  // This runs once on mount and whenever resolvedTheme changes from next-themes
  React.useEffect(() => {
    if (resolvedTheme) {
      storeSetTheme(resolvedTheme as "light" | "dark" | "system")
    }
  }, [resolvedTheme, storeSetTheme])

  return (
    <NextThemesProvider 
      {...props} 
      attribute="class" 
      defaultTheme="dark" // Set default theme to dark
      enableSystem
    >
      {children}
    </NextThemesProvider>
  )
}

// Optional: If you still want a hook to access the theme from Zustand consistently
export const useTheme = () => {
  const theme = useStore((state) => state.theme)
  const { setTheme: setNextTheme } = useNextThemeHook() // Get next-themes setter

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setNextTheme(newTheme) // Tell next-themes to change
    // Zustand will be updated by the useEffect in ThemeProvider via resolvedTheme
  }
  return { theme, setTheme }
}
