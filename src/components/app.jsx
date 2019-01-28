// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "../components/Dashboard";
import "../scss/main.scss";

// let sn_instance = "jnjprodworker.service-now.com";
// let boldchat_instance = "api.boldchat.com";

// useless comment to trigge compile

class App extends React.Component {
    render() {
        return <Dashboard refreshInterval={60000} />;
    }
}

export default App;
