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
class WidgetSNPubSubPlatformHealthSummary extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNPubSubPlatformHealthSummary", nodeResults: [] };

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
        let response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/sys_cluster_state`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                // sysparm_query: "client_transaction=true^sys_created_on>=javascript:gs.daysAgoStart(0)",
                // sysparm_count: "true",
                sysparm_display_value: "true"
                // sysparm_group_by: groupby_field
            }
        });

        let nodeResults = response.data.result.map(node => {
            // console.log("node", node);

            let parser = new DOMParser();
            let xmldoc = parser.parseFromString(node.stats, "text/xml");
            // console.log("xmldoc", xmldoc);

            let node_id = xmldoc.getElementsByTagName("system.cluster.node_id")[0].firstChild.wholeText;

            let uptime = xmldoc.getElementsByTagName("servlet.uptime")[0].firstChild.wholeText;
            let uptimeDays = parseFloat(uptime) / 1000 / 60 / 60 / 24;

            // Example: app128031.iad4.service-now.com:jnjprod033
            // Split it on either "." or ":"
            let [, location, , , friendlyName] = node_id.split(/[.:]+/);

            // Example: <sessionsummary end_user="212" logged_in="114" total="114"/>
            let sessionsummary = xmldoc.getElementsByTagName("sessionsummary");
            let logged_in = parseInt(sessionsummary[0].attributes["logged_in"].value);

            // Get system load (Example data)
            // <sys_load>
            // <one count="60" max="9" mean="1.3666666666666667" median="1.0" min="0" ninetypercent="4" ninetypercentTrimmedMean="0.8333"/>
            // <five count="300" max="13" mean="1.7166666666666666" median="1.0" min="0" ninetypercent="5" ninetypercentTrimmedMean="1.0407"/>
            // <fifteen count="900" max="25" mean="2.5244444444444443" median="1.0" min="0" ninetypercent="6" ninetypercentTrimmedMean="1.5975"/>
            // </sys_load>
            let sys_load = parseFloat(xmldoc.getElementsByTagName("sys_load")[0].childNodes[0].attributes["mean"].value);

            // Get SQL response (Example data)
            // <sql_response>
            // <one count="8771" max="788" mean="1.2182191312279103" median="0.0" min="0" ninetypercent="1" ninetypercentTrimmedMean="0.3407"/>
            // <five count="53999" max="4101" mean="1.675531028352377" median="0.0" min="0" ninetypercent="1" ninetypercentTrimmedMean="0.3055"/>
            // <fifteen count="203581" max="17034" mean="2.3490011346834923" median="0.0" min="0" ninetypercent="1" ninetypercentTrimmedMean="0.3196"/>
            // </sql_response>
            let sql_response = parseFloat(xmldoc.getElementsByTagName("sql_response")[0].childNodes[0].attributes["mean"].value);

            return {
                name: friendlyName,
                logged_in: logged_in,
                uptimeDays: uptimeDays,
                sys_load: sys_load,
                sql_response: sql_response,
                location: location
            };
        });

        // Update our own state with the new data
        this.setState({ nodeResults: nodeResults });
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
        if (this.state.nodeResults.length === 0) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Node</th>
                                <th>Uptime</th>
                                <th>Users</th>
                                <th>Load</th>
                                <th>DB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.nodeResults
                                // Only show nodes where there are users logged in
                                .filter(node => node["logged_in"] > 0)
                                .map((node, index) => {
                                    let numUsersColor =
                                        node["logged_in"] > 300 ? "cellRed" : node["logged_in"] > 250 ? "cellAmber" : "cellGreen";
                                    let sysLoadColor = node["sys_load"] > 12 ? "cellRed" : node["sys_load"] > 9 ? "cellAmber" : "cellGreen";
                                    let dbResponseColor =
                                        node["sql_response"] > 4 ? "cellRed" : node["sql_response"] > 3 ? "cellAmber" : "cellGreen";
                                    return (
                                        <tr key={node["name"]}>
                                            <td>{index}</td>
                                            <td>{node["name"]}</td>

                                            {/* Uptime */}
                                            <td align="right">{node["uptimeDays"].toFixed(1)}d</td>

                                            {/* Users Logged in */}
                                            <td className={classNames(numUsersColor)} align="right">
                                                {node["logged_in"]}
                                            </td>

                                            {/* sysLoad */}
                                            <td className={classNames(sysLoadColor)} align="right">
                                                {node["sys_load"].toFixed(1)}
                                            </td>

                                            {/* DB Response */}
                                            <td className={classNames(dbResponseColor)} align="right">
                                                {node["sql_response"].toFixed(1)}s
                                            </td>
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
        return <div className="single-num-title">ServiceNow Platform Health (Summary)</div>;
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
                widgetName="WidgetSNPubSubPlatformHealthSummary"
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
WidgetSNPubSubPlatformHealthSummary.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNPubSubPlatformHealthSummary.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNPubSubPlatformHealthSummary;

// =======================================================================================================
// =======================================================================================================
