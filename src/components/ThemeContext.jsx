import React from "react";

// Create ThemeContext, returns an Object with a Provider and a Consumer
const ThemeContext = React.createContext();

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;

// // Use the Context to create a Provider component that we'll later wrap around our app
// class ThemeProvider extends React.Component {
//     // Current Setting for theme
//     state = { theme: "light" };
//     // Add a class method to change the theme
//     toggleTheme = () => {
//         this.setState(({ theme }) => ({
//             theme: theme === "light" ? "dark" : "light"
//         }));
//     };
//     render() {
//         return <ThemeContext.Provider value={this.state.theme}>{this.props.children}</ThemeContext.Provider>;
//     }
// }
// // Later we can use <ThemeContext.Consumer>
// // Wrap the App in <ThemeProvider>
// // Lower down, wrap the Chart in <ThemeContext.Consumer>
