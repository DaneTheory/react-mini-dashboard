import React from "react";
import DashboardCard from "../components/DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";

// Create a class component
class WidgetUniqueLoginsToday extends React.Component {
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
        return (
            <div className="item">
                <div className="single-num-title">Unique Logins Today</div>
                <div className="single-num-value">{this.state.count}</div>
            </div>
        );
    }

    render() {
        return (
            <DashboardCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetUniqueLoginsToday">
                {this.renderCardBody()}
            </DashboardCard>
        );
    }
}

// Force the caller to include the proper attributes
WidgetUniqueLoginsToday.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetUniqueLoginsToday;
