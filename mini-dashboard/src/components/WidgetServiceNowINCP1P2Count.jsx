import React from "react";
import DashboardCard from "./DashboardCard";
import apiProxy from "../api/apiProxy";

// Create a widget class ----
class WidgetServiceNowP1P2Count extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget", count: [] };
    }

    componentDidMount = async () => {
        const response = await apiProxy.get("/sn/jnjsandbox.service-now.com/api/now/stats/incident", {
            params: { sysparm_query: "stateIN100,2^priorityIN1,2", sysparm_count: "true" }
        });
        console.log(response);
        this.setState({ count: response.data.result.stats.count });
    };

    renderCardBody() {
        return (
            <div>
                <div className="single-num-title">P1/P2 Incidents</div>
                <div className="single-num-value">{this.state.count}</div>
            </div>
        );
    }

    render() {
        return <DashboardCard widgetName="WidgetImageNames">{this.renderCardBody()}</DashboardCard>;
    }
}

export default WidgetServiceNowP1P2Count;
