// App.jsx
import * as React from "react";
import { useState } from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import StackNavigator from "./Navigation/StackNavigator";
import { ThemeContext } from "./constants/ThemeContext";
import { CustomLightTheme, CustomDarkTheme } from "./config/theme";

const App = () => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const paperTheme = mode === "dark" ? CustomDarkTheme : CustomLightTheme;
  const isDarkMode = mode === "dark";

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar
          backgroundColor={paperTheme.colors.primary}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />
        <StackNavigator />
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default App;
