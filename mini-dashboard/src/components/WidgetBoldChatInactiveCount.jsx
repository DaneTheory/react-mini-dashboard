import React from "react";
import DashboardCard from "./DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
// import moment from "moment";
var strftime = require("strftime");
var moment = require("moment");

// Create a class component
class WidgetBoldChatInactiveCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, boldchatCount: null };
    }

    componentDidMount = async () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)

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
            console.log(boldchat_response);
            console.log(boldchat_response.data.Data.length);
            accumulated_boldchats = accumulated_boldchats.concat(boldchat_response.data.Data);
            console.log(accumulated_boldchats.length);
            console.log(boldchat_response.data.Truncated);
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
        // Save into our component state
        this.setState({ boldchatCount: accumulated_boldchats.length });
    };

    renderCardHeader() {
        return <div className="single-num-title">BoldChats Inactive</div>;
    }

    renderCardBody() {
        return <div className="single-num-value">{this.state.boldchatCount}</div>;
    }

    render() {
        return (
            <DashboardCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetBoldChatInactiveCount"
            >
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardCard>
        );
    }

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

    // end of class
}

// Force the caller to include the proper attributes
WidgetBoldChatInactiveCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetBoldChatInactiveCount;
