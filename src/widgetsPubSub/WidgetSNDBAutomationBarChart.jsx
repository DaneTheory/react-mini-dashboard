// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNDBAutomationBarChart extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNDBAutomationBarChart", automationsByStartDay: {} };

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
        let agoUnitsStart = "days";
        let agoCountStart = 0;
        let agoUnitsEnd = "days";
        let agoCountEnd = -20;
        let response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/u_db_patch_schedulerr`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: `u_implementation_start_date>=javascript:gs.${agoUnitsStart}AgoStart(${agoCountStart})^u_implementation_start_date<=javascript:gs.${agoUnitsEnd}AgoStart(${agoCountEnd})`,
                sysparm_display_value: "true",
                sysparm_limit: 5000
            }
        });

        let automations = response.data.result;

        automations = automations.map(automation => {
            automation.u_implementation_start_date_monthdayyear = moment(automation.u_implementation_start_date).format("MM/DD/YY");
            return automation;
        });
        console.log("automations", automations);

        // Function to group array of objects (rows) by a single user-defined field
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});
        // Create a function to group rows by the field "target_instance"
        const groupByStartDay = groupBy("u_implementation_start_date_monthdayyear");

        // Loop through clone transaction, and group them by clone target (e.g. QA or Dev)
        // Produces object, where key is clone target (e.g. QA), and value is array of clone transactions
        var automationsByStartDay = groupByStartDay(automations);

        console.log("automationsByStartDay", automationsByStartDay);

        // Update our own state with the new data
        this.setState({ automationsByStartDay: automationsByStartDay });
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
        if (this.state.automationsByStartDay === {}) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.5vw" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Count</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* This uses destructuring to unpack the result of .entries() into key/value */}
                            {Object.entries(this.state.automationsByStartDay)
                                .sort((a, b) => {
                                    const a_key = a[0];
                                    const b_key = b[0];
                                    const return_value = moment(a_key).isBefore(b_key) ? -1 : 1;
                                    console.log(a_key, b_key, return_value);
                                    // .entries() gives us an array of key/value for each object, so [1] is the value
                                    // We want to sort by the designated "order" variable in each object
                                    return return_value;
                                })

                                .map(function([key, value]) {
                                    return (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value.length} DBs</td>
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
        return <div className="single-num-title">Automated DB Patches</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNDBAutomationBarChart"
            >
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
WidgetSNDBAutomationBarChart.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNDBAutomationBarChart.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNDBAutomationBarChart;

// =======================================================================================================
// =======================================================================================================
