import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";
import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetBoldChatActiveCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "WidgetBoldChatActiveCount", count: [], instance: props.instance, boldchatCount: null };
    }

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        // Load the data from the API (notice we're using the await keyword from the async framework)
        // ?FromDate=2019-01-08T08:00:01.000Z
        const response = await apiProxy.get(`/boldchat/${this.state.instance}/data/rest/json/v1/getActiveChats`, {
            params: {}
        });

        // Update our own state with the new data
        this.setState({ boldchatCount: response.data.Data.length });
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
        return <div className="single-num-title">BoldChats Active</div>;
    }

    renderCardBody() {
        return <div className="single-num-value">{this.state.boldchatCount}</div>;
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetBoldChatActiveCount"
            >
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
WidgetBoldChatActiveCount.defaultProps = {
    interval: 60
};

// Force the caller to include the proper attributes
WidgetBoldChatActiveCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default ReactTimeout(WidgetBoldChatActiveCount);
