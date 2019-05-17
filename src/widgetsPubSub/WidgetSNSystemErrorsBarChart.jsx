// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNSystemErrorsBarChart extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNSystemErrorsBarChart", count: [] };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Time is now 15:55pm
        //
        // sys_created_on>=javascript:gs.hoursAgoStart(3)^sys_created_on<javascript:gs.hoursAgoStart(2)
        // All records from 12:00pm to 12:59pm
        //
        // sys_created_on>=javascript:gs.hoursAgoStart(0)
        // 15:00 (current hour) to current
        //
        // sys_created_on>=javascript:gs.hoursAgoStart(1)
        // 14:00 to current

        // Retrieve our data (likely from an API)
        let response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/syslog`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.hoursAgoStart(0)^level=2",
                sysparm_count: "true"
            }
        });
        let count0 = response.data.result.stats.count;

        response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/syslog`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.hoursAgoStart(1)^sys_created_on<javascript:gs.hoursAgoStart(0)^level=2",
                sysparm_count: "true"
            }
        });
        let count1 = response.data.result.stats.count;

        response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/syslog`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.hoursAgoStart(2)^sys_created_on<javascript:gs.hoursAgoStart(1)^level=2",
                sysparm_count: "true"
            }
        });
        let count2 = response.data.result.stats.count;

        // Update our own state with the new data
        this.setState({ count: [count0, count1, count2] });
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

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">System Errors (Today)</div>
                <div className="single-num-value">
                    <NumberFormat value={this.state.count[0]} thousandSeparator={true} displayType={"text"} />
                    <br />
                    <NumberFormat value={this.state.count[1]} thousandSeparator={true} displayType={"text"} />
                    <br />
                    <NumberFormat value={this.state.count[2]} thousandSeparator={true} displayType={"text"} />
                </div>
            </div>
        );
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        if (this.state.count.length == 0) {
            return (
                <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="Loading data">
                    <div>Loading Data...</div>
                </DashboardDataCard>
            );
        } else {
            // We've got data, so load the chart now

            return (
                <DashboardDataCard
                    id={this.props.id}
                    position={this.props.position}
                    color={this.props.color}
                    widgetName="WidgetSNSystemErrorsBarChart"
                >
                    {this.renderCardBody()}
                </DashboardDataCard>
            );
        }
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetSNSystemErrorsBarChart.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNSystemErrorsBarChart.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNSystemErrorsBarChart;

// =======================================================================================================
// =======================================================================================================
