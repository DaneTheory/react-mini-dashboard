import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetSNNewIncidentToday extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetSNNewIncidentToday", count: [], instance: props.instance };
    }

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        // sysparm_query=sys_created_on>=javascript:gs.%sAgoStart(%s)^sys_updated_on>=javascript:gs.%sAgoStart(%s)

        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/incident`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.daysAgoStart(0)^sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        // console.log(response);

        // Update our own state with the new data
        this.setState({ count: response.data.result.stats.count });
    }

    async updateOurData() {
        // Start timer
        let startTime = new Date();

        // This function contains the custom logic to update our own data
        await this.customUpdateFunction();

        // Check to see if we're trying to update ourselves too often
        checkForAggressiveRefreshInterval(startTime, this.props.interval);

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
                <div className="single-num-title">New Incidents (Today)</div>
                <div className="single-num-value">{parseInt(this.state.count).toLocaleString("en")}</div>
            </div>
        );
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNNewIncidentToday"
            >
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetSNNewIncidentToday.propTypes = {
    instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
WidgetSNNewIncidentToday.defaultProps = {
    interval: 60
};

export default ReactTimeout(WidgetSNNewIncidentToday);
