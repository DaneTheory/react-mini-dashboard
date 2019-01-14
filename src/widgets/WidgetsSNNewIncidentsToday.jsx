import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";

// Create a class component
class WidgetSNNewIncidentToday extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance };
    }

    componentDidMount = async () => {
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
        this.setState({ count: response.data.result.stats.count });
    };

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">New Incidents (Today)</div>
                <div className="single-num-value">{this.state.count}</div>
            </div>
        );
    }

    render() {
        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNNewIncidentToday">
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetSNNewIncidentToday.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetSNNewIncidentToday;
