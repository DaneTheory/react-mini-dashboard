// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// Additional imports
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetIrisNewINCList extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetIrisNewINCList", wuArray: [], workUnitObject: { workunits: [] }, irisINCs: [] };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);

        this.trickleInNewIncidents = this.trickleInNewIncidents.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    trickleInNewIncidents(newIncidents) {
        let delayInMS = 2000;
        let totalDelay = delayInMS;
        for (let index = 0; index < newIncidents.length; index++) {
            const newINC = newIncidents[index];
            setTimeout(
                function() {
                    console.log(`New Incident: ${moment().format("hh:mm:ss A")}:`, newINC.number);
                    this.setState({ irisINCs: [...this.state.irisINCs, newINC] });
                }.bind(this),
                totalDelay
            );
            totalDelay = totalDelay + delayInMS;
        }
    }

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        function uniqueData(baselineData, newData) {
            let newIncidents = [];
            for (let index = 0; index < newData.length; index++) {
                const newINC = newData[index];
                let foundMatches = baselineData.find(function(oldINC) {
                    return oldINC.number === newINC.number;
                });
                if (!foundMatches) {
                    newIncidents.push(newINC);
                }
            }
            return newIncidents;
        }
        // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

        // Retrieve our (updated) data (likely from an API)
        let response_INC = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/incident`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.minutesAgoStart(5)^ORDERBYDESCsys_created_on",
                sysparm_display_value: "true",
                sysparm_limit: 10
            }
        });

        let newIncidents = response_INC.data.result;

        let uniqueIncidents = uniqueData(this.state.irisINCs, newIncidents);
        console.log(`New Incidents Found: ${uniqueIncidents.length}`);

        // This will return immediately so program execution can continue, but will trickle in new Incidents to the component state
        this.trickleInNewIncidents(uniqueIncidents);

        // Update our own component state with the new data, which will cause our component to re-render
        // this.setState({ irisINCs: incidents });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getInitialDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Retrieve our data (likely from an API)
        let response_INC = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/incident`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: "sys_created_on>=javascript:gs.minutesAgoStart(30)^ORDERBYDESCsys_created_on",
                sysparm_display_value: "true",
                sysparm_limit: 10
            }
        });

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ irisINCs: response_INC.data.result });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getInitialDataAndUpdateState();

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
    generateRows() {
        // This should only generate <tr> components, using a javascript .map() function if convenient
        {
            return this.state.irisINCs
                .sort((a, b) => {
                    // Sort the incidents by SLA from high to low
                    return moment().diff(a.sys_created_on, "seconds") - moment().diff(b.sys_created_on, "seconds");
                })
                .map(incident => {
                    // Construct a url to get to this incident
                    let host = this.props.sn_instance.replace("worker", "");
                    let sys_id = incident.sys_id;
                    let url = `https://${host}/nav_to.do?uri=/incident.do?sys_id=${sys_id}&sysparm_stack=&sysparm_view=`;
                    let priorityCSS = incident.priority === "Priority 4" ? "greenFont" : "amberFont";

                    return (
                        <tr key={incident["number"]} style={{ fontSize: "4vw" }}>
                            <td style={{ fontSize: "0.8vw" }}>
                                <a href={url} target="_blank" rel="noreferrer noopener">
                                    {incident["number"]}
                                </a>
                            </td>
                            <td style={{ fontSize: "0.7vw" }}>{incident["short_description"].substr(0, 60)}...</td>
                            <td style={{ fontSize: "0.7vw" }}>{incident["sys_created_by"]}</td>
                            <td className={priorityCSS} style={{ fontSize: "0.7vw" }}>
                                {incident["priority"]}
                            </td>
                            <td style={{ fontSize: "0.7vw" }}>
                                {moment(incident.sys_created_on).format("hh:mm:ss A")}
                                <br />
                                <span style={{ opacity: "0.35" }}>{moment().diff(incident.sys_created_on, "seconds")} secs ago</span>
                            </td>
                        </tr>
                    );
                });
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    renderAllTables() {
        if (this.state.irisINCs.length === 0) {
            // Show a please message while we're waiting for data from the API call
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            // OK, looks like we have incidents above the specified breach percentage, list them out
            var rowComponents = this.generateRows();
            return (
                <div>
                    <table style={{ marginBottom: "3vw" }}>
                        <thead>
                            <tr>
                                <th width="15%">INC</th>
                                <th width="40%">Short Description</th>
                                <th width="15%">Created By</th>
                                <th width="15%">Priority</th>
                                <th width="15%">Created</th>
                            </tr>
                        </thead>
                        <tbody>{rowComponents}</tbody>
                    </table>
                </div>
            );
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">New Incidents</div>;
    }

    renderCardBody() {
        return (
            <div
                className="item"
                data-tip={`Greater than ${this.props.redThreshold} is Red<br>Greater than ${this.props.amberThreshold} is Amber`}
            >
                {this.renderAllTables()}
            </div>
        );
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetIrisNewINCList">
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
WidgetIrisNewINCList.defaultProps = {
    sla_threshhold_pct: 50,
    redThreshold: 90,
    amberThreshold: 60
};

// Force the caller to include the proper attributes
WidgetIrisNewINCList.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    sla_threshhold_pct: PropTypes.number.isRequired,
    redThreshold: PropTypes.number,
    amberThreshold: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisNewINCList;

// =======================================================================================================
// =======================================================================================================
