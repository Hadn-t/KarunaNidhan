import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // Base colors
    primary: "#FF6B4A", // Slightly more vibrant than FF5733
    primaryContainer: "#FFF2EE",
    onPrimaryContainer: "#5A2A1E",

    background: "#f3e5e1", // Home screen bg
    surface: "#FFFFFF", // Card surfaces

    // Text & Surfaces
    onSurface: "#2C2C2C",
    onSurface20: "#555B61",
    onSurface40: "#6D737A",
    onSurface60: "#8A8F96",

    // Input Fields
    placeholder: "#888",
    disabled: "#C2C2C2",
    border: "#DADADA",

    // Flatlist / Cards
    cardBackground: "#FFFFFF",
    cardText: "#2E2E2E",
    cardSecondary: "#666666",
    cardLocation: "#999999",

    // Extras
    text: "#0D1B2A",
    secondary: "#FF9F80",
    error: "#D32F2F",

    // Bottom Navigation
    botIcon: "#001c38",
    botIconBG: "#d3e4ff",
    botBackground: "#f3f4f9",
  },
}

export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    // Base colors
    primary: "#FF9E80",
    primaryContainer: "#3A2A25",
    onPrimaryContainer: "#FFE0D6",

    background: "#1A1A1E",
    surface: "#2B2B2E",

    // Text & Surfaces
    onSurface: "#EAEAEA",
    onSurface20: "#B0BEC5",
    onSurface40: "#9CA8B2",
    onSurface60: "#7D8992",

    // Input Fields
    placeholder: "#9BA6AF",
    disabled: "#555",
    border: "#444",

    // Flatlist / Cards
    cardBackground: "#2F2F33",
    cardText: "#F0F0F0",
    cardSecondary: "#B0B0B0",
    cardLocation: "#9F9F9F",

    // Extras
    text: "#FFFFFF",
    secondary: "#FFA07A",
    error: "#EF5350",

    // Bottom Navigation
    botIcon: "#d7e2ff",
    botIconBG: "#2f4156",
    botBackground: "#13232c",
  },
}

export const colors = {
  light: CustomLightTheme.colors,
  dark: CustomDarkTheme.colors,
}
