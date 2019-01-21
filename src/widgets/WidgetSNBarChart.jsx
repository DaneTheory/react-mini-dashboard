import React from "react";
import DashboardChartCard from "../components/DashboardChartCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

// -----------------------------------

// Create a class component
class WidgetSNBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance };
    }

    componentDidMount = async () => {
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/sys_user_presence`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        // console.log(response);
        this.setState({ count: response.data.result.stats.count });
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

export default WidgetSNBarChart;
