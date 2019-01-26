import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetSNExperiment01 extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetSNExperiment01", count: [], instance: props.instance };
    }

    updateTrigger = () => {
        console.warn("Parent caused me to update!");
    };

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/incident`, {
            params: { sysparm_query: "stateIN100,2^priorityIN1,2", sysparm_count: "true" }
        });

        // Update our own state with the new data
        this.setState({ count: response.data.result.stats.count });
    }

    async updateOurData() {
        // Start timer
        let startTime = new Date();

        // This function contains the custom logic to update our own data
        await this.customUpdateFunction();

        // Check to see if we're trying to update ourselves too often
        checkForAggressiveRefreshInterval(startTime, this.props.interval, this.state.widgetName);

        // Set a timeOut to update ourselves again in refreshInterval
        this.props.setTimeout(() => {
            console.log(`${this.state.widgetName}: Updating data, interval is ${this.props.interval}s`);
            this.updateOurData();
        }, this.props.interval * 1000);
    }

    componentDidMount = async () => {
        this.updateOurData();
    };

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">Experiment 01 (P1/P2 In)</div>
                <div className="single-num-value">{parseInt(this.state.count).toLocaleString("en")}</div>
            </div>
        );
    }

    render() {
        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetImageNames">
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetSNExperiment01.propTypes = {
    instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
WidgetSNExperiment01.defaultProps = {
    interval: 60
};

export default ReactTimeout(WidgetSNExperiment01);
