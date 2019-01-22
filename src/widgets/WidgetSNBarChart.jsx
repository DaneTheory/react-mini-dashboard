import React from "react";
import DashboardChartCard from "../components/DashboardChartCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// -----------------------------------

// Create a class component
class WidgetSNBarChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetSNBarChart", count: [], instance: props.instance };
    }

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
        let data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "slategrey",
                    borderColor: "slategrey",
                    data: [0, 10, 5, 2, 20, 30, 45]
                }
            ]
        };

        return <Bar className="chart-itself" data={data} options={{ responive: true, maintainAspectRatio: false }} />;
    }

    render() {
        return (
            <DashboardChartCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNBarChart">
                {this.renderCardBody()}
            </DashboardChartCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetSNBarChart.propTypes = {
    instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
WidgetSNBarChart.defaultProps = {
    interval: 60
};

export default ReactTimeout(WidgetSNBarChart);
