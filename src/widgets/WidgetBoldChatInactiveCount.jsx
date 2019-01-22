import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// import moment from "moment";
var strftime = require("strftime");
var moment = require("moment");

// Create a class component
class WidgetBoldChatInactiveCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "WidgetBoldChatInactiveCount", count: [], instance: props.instance, boldchatCount: null };
    }

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        let agoUnits = "hours";
        let agoCount = 9;
        // Compute intial FromDate based on desired history (agoUnits and agoCount)
        var now = moment();
        let fromDateString = strftime("%Y-%m-%dT%H:%M:01.000Z", now.subtract(agoCount, agoUnits).toDate());

        let targetUrl = `/boldchat/${this.state.instance}/data/rest/json/v1/getInactiveChats`;
        let params = {
            FromDate: fromDateString
        };

        let boldchat_response = {};
        let truncated = true;
        let accumulated_boldchats = [];
        while (truncated) {
            // All checks passed, so get the data
            boldchat_response = await apiProxy.get(targetUrl, {
                params: params
            });
            accumulated_boldchats = accumulated_boldchats.concat(boldchat_response.data.Data);
            truncated = boldchat_response.data.Truncated;

            if (truncated) {
                // console.log(boldchat_response.data["Next"]["FromDate"]);
                // console.log(boldchat_response.data["Next"]["ToDate"]);
                let fromDateString = boldchat_response.data["Next"]["FromDate"];
                let toDateString = boldchat_response.data["Next"]["ToDate"];
                // console.log(fromDateString);
                // console.log(toDateString);
                params = {
                    FromDate: fromDateString,
                    ToDate: toDateString
                };
                // toDateString = "ToDate=%s" % (dataObject['Next']['ToDate'])
                // targetUrl = `/boldchat/${this.state.instance}/data/rest/json/v1/getInactiveChats?${fromDateParam}&${toDateParam}`;
            }
        }

        // Update our own state with the new data
        this.setState({ boldchatCount: accumulated_boldchats.length });
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

    renderCardHeader() {
        return <div className="single-num-title">BoldChats Inactive</div>;
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
                widgetName="WidgetBoldChatInactiveCount"
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
WidgetBoldChatInactiveCount.defaultProps = {
    interval: 60
};

// Force the caller to include the proper attributes
WidgetBoldChatInactiveCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default ReactTimeout(WidgetBoldChatInactiveCount);
