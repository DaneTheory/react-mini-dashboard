import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";
import PubSub from "pubsub-js";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetSNExperiment01 extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetSNExperiment01", count: [], instance: props.instance };

        // This is our event handler, it's called from the outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.updateViaPubSub = this.updateViaPubSub.bind(this);
    }

    updateTrigger = () => {
        console.warn("Parent caused me to update!");
    };

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/sys_user_presence`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
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

    updateViaPubSub(msg, data) {
        console.warn(msg, data);
        this.customUpdateFunction();
    }

    componentDidMount = async () => {
        // Self-generate our own update loop
        // this.updateOurData();
        // Subscribe to update events from our parent
        PubSub.subscribe("updateWidgetsEvent", this.updateViaPubSub);
    };

    componentWillUnmount() {
        // Unsubscribe from all pubsub events
        PubSub.unsubscribe(this.updateViaPubSub);
    }

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">Exp 01 (Unique Logins)</div>
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
