import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";

// Create a class component
class WidgetUniqueLoginsToday extends React.Component {
    constructor(props) {
        super(props);
        let refreshInterval = 60000;
        if (props.refreshInterval) {
            console.log("caller set our refresh interval to: " + props.refreshInterval);
            refreshInterval = props.refreshInterval;
        }
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, refreshInterval: refreshInterval };
        console.log("Constructor Name: " + this.constructor.name);
    }

    async updateOurData() {
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
        this.props.setTimeout(() => {
            console.log(`Will update again in ${this.state.refreshInterval} ms`);
            this.updateOurData();
        }, this.state.refreshInterval);
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
