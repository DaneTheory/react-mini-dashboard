import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";
import { duration } from "moment";

// Create a class component
class WidgetUniqueLoginsToday extends React.Component {
    constructor(props) {
        super(props);
        // Default refresh Interval
        let refreshInterval = 60;
        if (props.interval) {
            console.log("caller set our refresh interval to: " + props.interval);
            refreshInterval = props.interval;
        }
        this.state = { widgetName: "WidgetUniqueLoginsToday", count: [], instance: props.instance, refreshInterval: refreshInterval };
    }

    async updateOurData() {
        // Start timer
        let startTime = new Date();

        // Update our data
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/sys_user_presence`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });

        // Update our own state with the new data (and check timing)
        this.setState({ count: response.data.result.stats.count });
        let finishTime = new Date();
        let durationOfUpdateInMs = finishTime - startTime;
        let reasonableRefreshIntervalInSecs = (durationOfUpdateInMs / 1000) * 100;
        console.log(`reasonable refresh interval: ${reasonableRefreshIntervalInSecs}`);
        console.log(`duration of update: ${durationOfUpdateInMs}`);
        if (this.state.refreshInterval < reasonableRefreshIntervalInSecs) {
            console.warn(
                `Warning, refresh interval (${this.state.refreshInterval}s) is fast compared to length of update (${durationOfUpdateInMs /
                    1000}s)`
            );
        }

        // Set a timeOut to update ourselves again in refreshInterval
        this.props.setTimeout(() => {
            console.log(`${this.state.widgetName}: Updating data, interval is ${this.state.refreshInterval}s`);
            this.updateOurData();
        }, this.state.refreshInterval * 1000);
    }

    componentDidMount = async () => {
        this.updateOurData();
    };

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">Unique Logins Today</div>
                <div className="single-num-value">{this.state.count}</div>
            </div>
        );
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetUniqueLoginsToday"
            >
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetUniqueLoginsToday.propTypes = {
    instance: PropTypes.string.isRequired
};

export default ReactTimeout(WidgetUniqueLoginsToday);
