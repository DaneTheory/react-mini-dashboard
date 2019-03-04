// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

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
                // cmdb_ci=a702870c5bad6000705b113d2c4254ca^assignment_group=ad8064fd5bcd2000d5a0113d2c425417^ORassignment_group=e6b0cfa0db1bd780d67644303996197c^u_stateNOT IN800,900
                sysparm_display_value: "true",
                sysparm_limit: 500
            }
        });

        console.warn("inc", response_INC);

        // Update our own state with the new data
        // this.setState({ irisINCs: response_INC.data.result });

        let incidents_all = await Promise.all(
            response_INC.data.result.map(async incident => {
                console.log(incident.number);

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
                let a = response_sla.data.result[0].percentage;
                a = a.replace(/,/g, "");
                console.warn(incident.number, a, parseFloat(a));
                incident.sla_pct = parseFloat(a);

                return incident;
            })
        );
        console.error("Done!");
        console.log(incidents_all);

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
        if (this.state.irisINCs.length === 0) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.irisINCs
                                .sort((a, b) => {
                                    return b.sla_pct - a.sla_pct;
                                })
                                .filter(incident => {
                                    return incident.sla_pct > 50;
                                })
                                .map((incident, index) => {
                                    // let createdAgo = moment(incident.sys_created_on).fromNow();
                                    let sla_pct = incident.sla_pct;
                                    let slaColorClass = sla_pct > 90 ? "cellRed" : sla_pct > 60 ? "cellAmber" : "cellGreen";
                                    return (
                                        <tr key={incident["number"]} style={{ fontSize: "4vw" }}>
                                            <td style={{ fontSize: "1.5vw" }}>{index + 1}</td>
                                            <td style={{ fontSize: "1.0vw" }}>{incident["number"]}</td>
                                            <td style={{ fontSize: "1.0vw" }} className={classNames(slaColorClass)}>
                                                <NumberFormat
                                                    value={sla_pct}
                                                    decimalScale={0}
                                                    fixedDecimalScale={true}
                                                    displayType={"text"}
                                                />
                                                %
                                            </td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["short_description"].substr(0, 90)}...</td>
                                            <td style={{ fontSize: "0.9vw" }}>{incident["sys_created_by"]}</td>
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
        return <div className="single-num-title">Iris Incidents (Breached>50%)</div>;
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
WidgetIrisINCBreachList.defaultProps = {};

// Force the caller to include the proper attributes
WidgetIrisINCBreachList.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisINCBreachList;

// =======================================================================================================
// =======================================================================================================
