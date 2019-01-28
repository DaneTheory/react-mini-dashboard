// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// These have to be after imports
var strftime = require("strftime");
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetBoldChatInactiveCount extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetBoldChatInactiveCount", boldchatCount: null };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Retrieve our data (likely from an API)
        let agoUnits = "hours";
        let agoCount = 9;
        // Compute intial FromDate based on desired history (agoUnits and agoCount)
        var now = moment();
        let fromDateString = strftime("%Y-%m-%dT%H:%M:01.000Z", now.subtract(agoCount, agoUnits).toDate());

        let targetUrl = `/boldchat/${this.props.boldchat_instance}/data/rest/json/v1/getInactiveChats`;
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
            }
        }

        // Update our own state with the new data
        this.setState({ boldchatCount: accumulated_boldchats.length });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentWillUnmount() {
        // Standard React Lifecycle method, gets called by React itself
        // Gets called once before React unmounts and destroys our component

        // Unsubscribe from all pubsub events
        PubSub.unsubscribe(this.getDataAndUpdateState);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetBoldChatInactiveCount"
            >
                <div className="single-num-title">BoldChats Inactive</div>
                <div className="single-num-value">{this.state.boldchatCount}</div>
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetBoldChatInactiveCount.defaultProps = {};

// Force the caller to include the proper attributes
WidgetBoldChatInactiveCount.propTypes = {
    boldchat_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetBoldChatInactiveCount;

// =======================================================================================================
// =======================================================================================================
