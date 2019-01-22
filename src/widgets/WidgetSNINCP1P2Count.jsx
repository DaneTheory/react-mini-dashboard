import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetSNINCP1P2Count extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetSNINCP1P2Count", count: [], instance: props.instance };
    }

    componentDidMount = async () => {
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/incident`, {
            params: { sysparm_query: "stateIN100,2^priorityIN1,2", sysparm_count: "true" }
        });
        this.setState({ count: response.data.result.stats.count });
    };

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">P1/P2 Incidents</div>
                <div className="single-num-value">{this.state.count}</div>
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
WidgetSNINCP1P2Count.propTypes = {
    instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
WidgetSNINCP1P2Count.defaultProps = {
    interval: 60
};

export default WidgetSNINCP1P2Count;
