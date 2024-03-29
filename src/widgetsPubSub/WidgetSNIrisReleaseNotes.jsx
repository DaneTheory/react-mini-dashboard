// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import { createURLforServiceNowWorkUnit } from "../utilities/createURLforServiceNowWorkUnit";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNIrisReleaseNotes extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNIrisReleaseNotes", wuArray: [], wuByDate: { workunits: [] } };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let releaseDaysAway = 60;
        let releaseDaysPrior = 30;

        // Retrieve our data (likely from an API)
        let fields = [
            "number",
            "sys_id",
            "short_description",
            "u_release_number.u_product.number",
            "u_dev_estimation",
            "u_test_estimation",
            "sys_created_by",
            "sys_created_on",
            "short_description",
            "sys_updated_on",
            "u_release_number.number",
            "u_release_number.u_release_titile",
            "u_release_number.u_release_date",
            "u_release_number.short_description",
            "u_release_number.sys_id",
            "u_work_unit_owner.user_name",
            "u_title",
            "u_process",
            "u_request_type",
            "u_what_s_changed"
        ];
        let response_wu = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/rm_enhancement`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: `u_release_numberISNOTEMPTY^u_release_number.u_release_dateISNOTEMPTY^u_release_number.u_release_date>=javascript:gs.daysAgoStart(${releaseDaysPrior})^u_release_number.u_release_date<=javascript:gs.daysAgoStart(${0 -
                    releaseDaysAway})^u_release_number.u_product.number=PDCT000010000001^ORDERBYu_release_number.u_release_date`,
                // sysparm_count: "true",
                sysparm_display_value: "true",
                sysparm_limit: 200,
                sysparm_fields: fields.join(",")
                // sysparm_group_by: groupby_field
            }
        });

        var wuResults = response_wu.data.result;

        // # Construct URL for each Work Unit
        for (let i = 0; i < wuResults.length; i++) {
            let wu = wuResults[i];
            wu["u_url"] = createURLforServiceNowWorkUnit(this.props.sn_instance, wu["sys_id"]);
        }

        // Group by u_release_number.u_release_date
        var wuResultsByDate = {};
        wuResults.forEach(function(wu) {
            // Remove "ISM " from process names, seems silly since every process name has "ISM " in it
            if (wu["u_process"]) {
                wu["u_process"] = wu["u_process"].replace("ISM ", "");
                wu["u_process"] = wu["u_process"].replace("Service Request - SID", "Catalog");
            }
            var releaseDate = wu["u_release_number.u_release_date"];
            if (!wuResultsByDate[releaseDate]) {
                // first time I'm seeing this release date
                wuResultsByDate[releaseDate] = [wu];
            } else {
                // I've seen this release date before, append to it
                wuResultsByDate[releaseDate].push(wu);
            }
            // Sort array by work unit number so that work units are always in the same order on refreshes
            wuResultsByDate[releaseDate].sort(function(a, b) {
                return parseInt(a["number"].substr(9)) - parseInt(b["number"].substr(9));
            });
        });
        console.log("wuResultsByDate", wuResultsByDate);

        // Convert object to array of arrays
        var wuResultsByDateArray = [];
        for (var theDate in wuResultsByDate) {
            wuResultsByDateArray.push({ releaseDate: theDate, workUnits: wuResultsByDate[theDate] });
        }

        let wuByDate = {};
        wuByDate["releaseDaysPrior"] = releaseDaysPrior;
        wuByDate["releaseDaysAway"] = releaseDaysAway;
        wuByDate["workunits"] = wuResultsByDateArray;
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ wuByDate: wuByDate });

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ wuArray: response_wu.data.result });
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
    renderTable(wuArray) {
        return (
            <table width="90%" style={{ marginBottom: "4vw" }}>
                <thead style={{ fontSize: "0.6vw" }}>
                    <tr>
                        <th>#</th>
                        <th>Work Unit</th>
                        <th>Process Area</th>
                        <th>Title</th>
                        <th>What&apos;s Changed</th>
                        <th>Test Points</th>
                        <th>Dev Points</th>
                        <th>Release Title</th>
                    </tr>
                </thead>
                <tbody className="Font10x">
                    {wuArray.map((wu, index) => {
                        return (
                            <tr key={wu["number"]}>
                                <td style={{ padding: "1vw" }}>#{index + 1}</td>
                                <td style={{ width: "10vw", padding: "1vw" }}>
                                    <a href={wu["u_url"]} target="_blank" rel="noreferrer noopener">
                                        {wu["number"]}
                                    </a>
                                    <br />
                                    <br />
                                    {wu["u_request_type"]}
                                </td>
                                <td style={{ width: "10vw", padding: "1vw" }}>{wu["u_process"]}</td>
                                <td style={{ width: "20vw", padding: "1vw" }}>{wu["u_title"]}</td>
                                <td style={{ padding: "1vw" }}>{wu["u_what_s_changed"]}</td>
                                <td style={{ width: "3vw", padding: "1vw" }}>{wu["u_test_estimation"]}</td>
                                <td style={{ width: "3vw", padding: "1vw" }}>{wu["u_dev_estimation"]}</td>
                                <td style={{ padding: "1vw" }}>{wu["u_release_number.u_release_titile"]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    renderAllTables() {
        if (this.state.wuArray.length === 0) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    {this.state.wuByDate.workunits.map((singleRelease, index) => {
                        return (
                            <div key={index}>
                                <div className="Font16x" style={{ textAlign: "left", marginBottom: "1vw", marginLeft: "2vw" }}>
                                    Release Date: {singleRelease.releaseDate}
                                </div>
                                {this.renderTable(singleRelease.workUnits)}
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    renderCardHeader() {
        return;
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
                widgetName="WidgetSNIrisReleaseNotes"
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
WidgetSNIrisReleaseNotes.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNIrisReleaseNotes.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNIrisReleaseNotes;

// =======================================================================================================
// =======================================================================================================
