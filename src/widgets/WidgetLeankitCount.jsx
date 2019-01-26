import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetLeankitCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetLeankitCount", instance: props.instance, count: null };
    }

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        let response = await apiProxy.get(`/leankit-npm/${this.state.instance}/board/372745411`, {
            params: {}
        });

        // Update our own state with the new data
        this.setState({ count: response.data.cards.length });
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

    renderCardHeader() {
        return <div className="single-num-title">Leankit Count</div>;
    }

    renderCardBody() {
        return <div className="single-num-value">{this.state.count}</div>;
    }

    render() {
        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetLeankitCount">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

    // end of class
}

// Set default props in case they aren't passed to us by the caller
WidgetLeankitCount.defaultProps = {
    interval: 60
};

// Force the caller to include the proper attributes
WidgetLeankitCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default ReactTimeout(WidgetLeankitCount);
