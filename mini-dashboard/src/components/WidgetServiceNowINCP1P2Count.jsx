import React from "react";
import DashboardCard from "./DashboardCard";
import servicenow from "../api/servicenow";

// Create a widget class ----
class WidgetServiceNowP1P2Count extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget", count: [] };
    }

    componentDidMount = async () => {
        const response = await servicenow.get(
            "http://192.168.1.177:8000/servicenow-proxy/jnjsandbox.service-now.com/api/now/stats/incident?sysparm_query=stateIN100%2C2%5EpriorityIN1%2C2&sysparm_count=true",
            {}
        );
        console.log(response);
        this.setState({ count: response.data.result.stats.count });
    };

    renderCardBody() {
        return (
            <div>
                <h1>Count: {this.state.count}</h1>
            </div>
        );
    }

    render() {
        return <DashboardCard widgetName="WidgetImageNames">{this.renderCardBody()}</DashboardCard>;
    }
}

export default WidgetServiceNowP1P2Count;
