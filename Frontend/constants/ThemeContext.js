"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useColorScheme } from "react-native"
import { CustomLightTheme, CustomDarkTheme } from "../config/theme"

// Create the context with default values
export const ThemeContext = createContext({
  theme: CustomLightTheme,
  mode: "light",
  toggleTheme: () => {},
  isDarkMode: false,
})

// Custom hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const colorScheme = useColorScheme()
  const [mode, setMode] = useState(colorScheme || "light")

  // Update theme when device theme changes
  useEffect(() => {
    if (colorScheme) {
      setMode(colorScheme)
    }
  }, [colorScheme])

  const theme = mode === "dark" ? CustomDarkTheme : CustomLightTheme

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  // Ensure the context value is never undefined
  const contextValue = {
    theme,
    mode,
    toggleTheme,
    isDarkMode: mode === "dark",
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
