// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import kittens from "./kittens.png";

// Additional imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetIrisINCBreachList extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetIrisINCBreachList", wuArray: [], workUnitObject: { workunits: [] }, irisINCs: [] };

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
        let grpTSRRTCS = "e6b0cfa0db1bd780d67644303996197c";
        let grpIrisL2 = "ad8064fd5bcd2000d5a0113d2c425417";
        let IrisCI = "a702870c5bad6000705b113d2c4254ca";
        let response_INC = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/incident`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: `cmdb_ci=${IrisCI}^assignment_group=${grpIrisL2}^ORassignment_group=${grpTSRRTCS}^u_stateNOT IN800,900`,
                sysparm_display_value: "true",
                sysparm_limit: 500
            }
        });

        // Loop through tickets, and get the incident metrics for each
        let incidents_all = await Promise.all(
            response_INC.data.result.map(async incident => {
                let inc_sys_id = incident.sys_id;
                let response_sla = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/task_sla`, {
                    params: {
                        // Units for xAgoStart: years, months, days, hours, minutes
                        sysparm_query: `task=${inc_sys_id}`,
                        // cmdb_ci=a702870c5bad6000705b113d2c4254ca^assignment_group=ad8064fd5bcd2000d5a0113d2c425417^ORassignment_group=e6b0cfa0db1bd780d67644303996197c^u_stateNOT IN800,900
                        sysparm_display_value: "true",
                        sysparm_limit: 500
                    }
                });
                let sla_records = response_sla.data.result;

                // Incident can have multiple SLA records, look for record that's "in progress", and contains the word "resolution"
                let sla_records_resolution_in_progress = sla_records.filter(sla_record => {
                    return sla_record.stage === "In progress" && sla_record.sla.display_value.toLowerCase().includes("resolution");
                });
                // Select the first (and likely only) SLA record that matches criteria
                if (sla_records_resolution_in_progress.length !== 1) {
                    console.warning(`Didn't see exactly 1 SLA record for ${incident.number}`, sla_records);
                    // Since this Incident appears to NOT have an SLA record, don't include in results (simply return)
                    return;
                } else {
                    let sla_record = sla_records_resolution_in_progress[0];
                    console.log(sla_record);

                    // Compute a proper percentage by removing comma from string (e.g. 1,014) and converting string to float, assign back to record
                    let sla_pct_string_without_comma = sla_record.percentage.replace(/,/g, "");
                    sla_record.sla_pct_float = parseFloat(sla_pct_string_without_comma);

                    // Assign the modified SLA record back to the incident
                    incident.sla_record = sla_record;

                    return incident;
                }
            })
        );

        // Update our own state with the new data
        this.setState({ irisINCs: incidents_all });
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

    renderAllTables() {
        let sla_threshold_pct = this.props.sla_threshhold_pct;
        if (this.state.irisINCs.length === 0) {
            // Show a please message while we're waiting for data from the API call
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else if (
            // If there are zero incidents above specified breach pct, then show a fun picture
            this.state.irisINCs.filter(incident => {
                return incident.sla_record.sla_pct_float > sla_threshold_pct;
            }).length === 0
        ) {
            // Show a fun picture
            return (
                <div>
                    <br />
                    <div>Way to go ! &nbsp;&nbsp; Zero Incidents nearing breach.</div>
                    <div />
                    <div style={{ marginBottom: "3vw" }}>Here&apos;s a picture of kittens</div>
                    <img style={{ width: "20vw" }} src={kittens} alt="" />
                </div>
            );
        } else {
            // OK, looks like we have incidents above the specified breach percentage, list them out
            return (
                <div>
                    <table width="90%" style={{ marginBottom: "3vw" }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>INC</th>
                                <th>Breach</th>
                                <th>Short Description</th>
                                <th>Created By</th>
                                <th>Priority</th>
                                <th>Time Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.irisINCs
                                .sort((a, b) => {
                                    // Sort the incidents by SLA from high to low
                                    return b.sla_record.sla_pct_float - a.sla_record.sla_pct_float;
                                })
                                .filter(incident => {
                                    // Only show incidents that have exceeded the prescribed SLA percentage
                                    return incident.sla_record.sla_pct_float > sla_threshold_pct;
                                })
                                .map((incident, index) => {
                                    // Construct a url to get to this incident
                                    let host = this.props.sn_instance.replace("worker", "");
                                    let sys_id = incident.sys_id;
                                    let url = `https://${host}/nav_to.do?uri=/incident.do?sys_id=${sys_id}&sysparm_stack=&sysparm_view=`;

                                    // Determine % of sla that we've consume, and assign a RAG indictor to it
                                    let sla_pct = incident.sla_record.sla_pct_float;
                                    let slaColorClass = sla_pct > 90 ? "cellRed" : sla_pct > 60 ? "cellAmber" : "cellGreen";

                                    return (
                                        <tr key={incident["number"]} style={{ fontSize: "4vw" }}>
                                            <td style={{ fontSize: "1.5vw" }}>{index + 1}</td>
                                            <td style={{ fontSize: "1.0vw" }}>
                                                <a href={url}>{incident["number"]}</a>
                                            </td>
                                            <td style={{ fontSize: "1.0vw" }} className={classNames(slaColorClass)}>
                                                <NumberFormat
                                                    value={sla_pct}
                                                    decimalScale={0}
                                                    fixedDecimalScale={true}
                                                    displayType={"text"}
                                                />
                                                %
                                            </td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["short_description"].substr(0, 60)}...</td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["sys_created_by"]}</td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["priority"]}</td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["sla_record"]["business_time_left"]}</td>
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
        return <div className="single-num-title">Iris Incidents (Breached&gt;{this.props.sla_threshhold_pct}%)</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderAllTables()}</div>;
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
                widgetName="WidgetIrisINCBreachList"
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
WidgetIrisINCBreachList.defaultProps = {
    sla_threshhold_pct: 50
};

// Force the caller to include the proper attributes
WidgetIrisINCBreachList.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    sla_threshhold_pct: PropTypes.number.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisINCBreachList;

// =======================================================================================================
// =======================================================================================================
