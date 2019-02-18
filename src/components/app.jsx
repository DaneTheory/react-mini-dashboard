// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "../components/Dashboard";
import "../scss/main.scss";
import { ThemeProvider } from "../components/ThemeContext";

let theme = {
    darkColorTheme: {
        colorThemePageBackground: "#636977",
        colorThemeCardBackground: "#2b2d3e",
        colorThemeFontDefault: "#bbb3b3",
        colorThemeCardFont: "#eeeeee",
        colorThemePageTitle: "#bbb3b3",
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeWidgetLinks: "#4183c4",
        colorThemeScrollbarTrackBackground: "#2b2d3e",
        colorThemeScrollbarThumbBackground: "#000",
        colorThemeChartData: "#c0cde2",
        colorThemeCardBlueFont: "#0bc2f0",
        colorThemeCardTableGridLines: "#b9b9b998",
        colorThemeCardGreenFont: "#66ff66",
        colorThemeCardRedFont: "#ff6666",

        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#6f256f",

        colorThemeCardTableCellBackgroundRed: "#af0000",
        colorThemeCardTableCellBackgroundAmber: "#e46e00",
        colorThemeCardTableCellBackgroundGreen: "#009c00"
    },

    lightColorTheme: {
        colorThemePageBackground: "#ffffff",
        colorThemeCardBackground: "#e7ecf7",
        colorThemeFontDefault: "#000000",
        colorThemeCardFont: "#000000",
        colorThemePageTitle: "#000000",
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeWidgetLinks: "#4183c4",
        colorThemeScrollbarTrackBackground: "#242524",
        colorThemeScrollbarThumbBackground: "#696464",
        colorThemeChartData: "#192453",
        colorThemeCardBlueFont: "#00add8",
        colorThemeCardTableGridLines: "#b9b9b998",
        colorThemeCardGreenFont: "#36a336",
        colorThemeCardRedFont: "#ff6666",

        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#6f256f",

        colorThemeCardTableCellBackgroundRed: "#d40000",
        colorThemeCardTableCellBackgroundAmber: "#ff7b00",
        colorThemeCardTableCellBackgroundGreen: "#00c200"
    },
    currentColorTheme: null
};

// Select a color theme to use
theme.currentColorTheme = theme.lightColorTheme;

// Apply the chose color theme to all of our CSS color variables
Object.entries(theme.currentColorTheme).forEach(color => {
    let colorName = color[0];
    let colorHexCode = color[1];
    // We're reaching into CSS root style sheet, and updating known variable names
    document.documentElement.style.setProperty("--" + colorName, colorHexCode);
});

class App extends React.Component {
    render() {
        return (
            <ThemeProvider value={theme}>
                <Dashboard refreshInterval={60000} theme={theme.current} />;
            </ThemeProvider>
        );
    }
}

export default App;
