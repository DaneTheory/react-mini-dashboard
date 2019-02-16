// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// Additional imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNAPICounts extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNAPICounts", app_ids: [] };

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
        let response = await apiProxy.get("/azure-app-insights-api/dev/metrics/requests/count", {
            params: {
                timespan: "P7D",
                aggregation: "sum",
                segment: "customDimensions/requester"
            }
        });

        let app_ids = response.data.value.segments.map(segment => {
            return {
                appid: segment["customDimensions/requester"],
                count: segment["requests/count"]["sum"]
            };
        });

        // Update our own state with the new data
        this.setState({ app_ids: app_ids });
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

    renderTable() {
        if (this.state.OSInfo === {}) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>App ID</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.app_ids.map((app_id, index) => {
                                return (
                                    <tr key={app_id["appid"]}>
                                        <td>{index + 1}</td>
                                        <td>{app_id["appid"]}</td>
                                        <td>{app_id["count"]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Apigee API Counts (7 days)</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNAPICounts">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetSNAPICounts.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNAPICounts.propTypes = {
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNAPICounts;

// =======================================================================================================
// =======================================================================================================
