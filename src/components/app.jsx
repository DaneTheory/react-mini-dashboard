// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "../components/Dashboard";
import "../scss/main.scss";
import { ThemeProvider } from "../components/ThemeContext";

console.log("process.env", process.env);

let theme = {
    darkColorTheme: {
        // Page
        colorThemePageBackground: "#636977",
        colorThemePageTitle: "#bbb3b3",

        // Default
        colorThemeFontDefault: "#bbb3b3",

        // Card
        colorThemeCardBackground: "#2b2d3e",
        colorThemeCardFontDefault: "#eeeeee",
        colorThemeCardFontBlue: "#0bc2f0",
        colorThemeCardFontGreen: "#66ff66",
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardTableGridLines: "#b9b9b998",
        colorThemeCardTableCellBackgroundRed: "#af0000",
        colorThemeCardTableCellBackgroundAmber: "#e46e00",
        colorThemeCardTableCellBackgroundGreen: "#009c00",

        // LeftNav
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeLeftNavLinks: "#bbb3b3",
        colorThemeLeftNavLinksHover: "#4183c4",

        // Widget Links
        colorThemeWidgetLinks: "#4183c4",

        // Scrollbar
        colorThemeScrollbarTrackBackground: "#2b2d3e",
        colorThemeScrollbarThumbBackground: "#000",

        // Chart
        colorThemeChartData: "#c0cde2",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#e749e7"
    },

    lightColorTheme: {
        // Page
        colorThemePageBackground: "#ffffff",
        colorThemePageTitle: "#000000",

        // Default
        colorThemeFontDefault: "#000000",

        // Card
        colorThemeCardBackground: "#e7ecf7",
        colorThemeCardFontDefault: "#000000",
        colorThemeCardFontBlue: "#00add8",
        colorThemeCardFontGreen: "#36a336",
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardTableGridLines: "#b9b9b998",
        colorThemeCardTableCellBackgroundRed: "#d40000",
        colorThemeCardTableCellBackgroundAmber: "#ff7b00",
        colorThemeCardTableCellBackgroundGreen: "#00c200",

        // Left Nav
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeLeftNavLinks: "#bbb3b3",

        // Widget Links
        colorThemeWidgetLinks: "#4183c4",

        // Srollbar
        colorThemeScrollbarTrackBackground: "#242524",
        colorThemeScrollbarThumbBackground: "#696464",

        // Chart
        colorThemeChartData: "#192453",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#6f256f"
    },
    currentColorTheme: null
};

// Select a color theme to use
theme.currentColorTheme = theme.darkColorTheme;

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
