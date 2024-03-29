// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "../components/Dashboard";
import "../scss/main.scss";
import { ThemeProvider } from "../components/ThemeContext";

// console.log("process.env", process.env);

// Diagnostic tool that describes why React component updated (rendered), put helpful logging to concole
if (process.env.NODE_ENV !== "production") {
    const { whyDidYouUpdate } = require("why-did-you-update");

    // Show a specific widget
    // whyDidYouUpdate(React, { include: [/WidgetLeankitDiscoverySolutioningCardNearingBreachList/] });

    // Removed stuff that was running too much
    whyDidYouUpdate(React, {
        exclude: [
            /^Route/,
            /^Link/,
            /^ContextProvider/,
            /^Chart/,
            /^Script/,
            /^GoogleChart/,

            // Wish they would convert ReactToolTip to PureComponent
            /^ReactTooltip/,

            // here is a comment
            /^NumberFormat/,

            /^DashboardDataCard/,
            /^Transition$/,
            /^CSSTransition$/
        ]
    });
}

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
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardFontAmber: "#e46e00",
        colorThemeCardFontGreen: "#66ff66",
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
        colorThemeScrollbarTrackBackground: "#5c5f7a",
        colorThemeScrollbarThumbBackground: "#988b8b",

        // Chart
        colorThemeChartData: "#c0cde2",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#e749e7"
    },

    lightColorTheme: {
        // Page
        colorThemePageBackground: "#d7d8db",
        colorThemePageTitle: "#000000",

        // Default
        colorThemeFontDefault: "#000000",

        // Card
        colorThemeCardBackground: "#c3c4c6",
        colorThemeCardFontDefault: "#000000",
        colorThemeCardFontBlue: "#0159b7",
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardFontAmber: "#cd7d32",
        colorThemeCardFontGreen: "#36a336",
        colorThemeCardTableGridLines: "#969696",
        colorThemeCardTableCellBackgroundRed: "#a93737",
        colorThemeCardTableCellBackgroundAmber: "#cd7d32",
        colorThemeCardTableCellBackgroundGreen: "#2fb12f",

        // Left Nav
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeLeftNavLinks: "#bbb3b3",
        colorThemeLeftNavLinksHover: "#4183c4",

        // Widget Links
        colorThemeWidgetLinks: "#4183c4",

        // Srollbar
        colorThemeScrollbarTrackBackground: "#ebebeb",
        colorThemeScrollbarThumbBackground: "#9c9c9c",

        // Chart
        colorThemeChartData: "#192453",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#6f256f"
    },
    currentColorTheme: null
};

// Select/Pick/Toggle a color theme to use
theme.currentColorTheme = theme.lightColorTheme;
// theme.currentColorTheme = theme.darkColorTheme;

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
                {/* 300k = 5m, 900k = 15m, 3600k = 60m */}
                <Dashboard reloadInterval={15 * 60 * 1000} refreshInterval={60 * 1000} theme={theme.current} />
            </ThemeProvider>
        );
    }
}

export default App;
