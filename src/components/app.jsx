// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "../components/Dashboard";
import "../scss/main.scss";

class App extends React.Component {
    render() {
        return <Dashboard refreshInterval={60000} />;
    }
}

export default App;
