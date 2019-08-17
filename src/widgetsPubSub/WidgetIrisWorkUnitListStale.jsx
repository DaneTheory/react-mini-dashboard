// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import { createURLforServiceNowWorkUnit } from "../utilities/createURLforServiceNowWorkUnit";

// Additional imports
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetIrisWorkUnitListStale extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetIrisWorkUnitListStale", wuArray: [], workUnitObject: { workunits: [] } };

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
            "u_what_s_changed",
            "u_sdlc_phase",
            "u_sdlc_status"
        ];

        let daysOld = this.props.yearsOldThreshhold * 365;
        let irisProductID = "967f5101b14c4580ce38de7ebbabfe4e";
        let response_wu = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/table/rm_enhancement`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: `sys_created_on<=javascript:gs.daysAgoStart(${daysOld})^u_sdlc_phaseNOT INClosed,Canceled^u_product=${irisProductID}^ORDERBYsys_created_on`,
                sysparm_display_value: "true",
                sysparm_limit: 500,
                sysparm_fields: fields.join(",")
            }
        });

        let workUnits = response_wu.data.result;
        // # Construct URL for each Work Unit
        for (let i = 0; i < workUnits.length; i++) {
            let wu = workUnits[i];
            wu["u_url"] = createURLforServiceNowWorkUnit(this.props.sn_instance, wu["sys_id"]);
        }

        // Update our own component state with the new data, which will cause our component to re-render
        let workUnitObject = {};
        workUnitObject["daysOld"] = daysOld;
        workUnitObject["workunits"] = workUnits;
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ workUnitObject: workUnitObject });
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
            <table width="90%" style={{ marginBottom: "3vw" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Work Unit</th>
                        <th>Process Area</th>
                        <th>Short Description</th>
                        <th>Created On</th>
                        <th>Updated On</th>
                        <th>Phase</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {wuArray.map((wu, index) => {
                        // let createdAgo = moment(wu.sys_created_on).fromNow();
                        let createdAgo = moment().diff(moment(wu.sys_created_on), "years", true);
                        let updatedAgo = moment(wu.sys_updated_on).fromNow();
                        let createdColorClass =
                            createdAgo > this.props.redThreshold
                                ? "cellRed"
                                : createdAgo > this.props.amberThreshold
                                    ? "cellAmber"
                                    : "cellGreen";
                        return (
                            <tr key={wu["number"]}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={wu["u_url"]} target="_blank" rel="noreferrer noopener">
                                        {wu["number"]}
                                    </a>
                                    <br />
                                    {wu["u_request_type"]}
                                </td>
                                <td>{wu["u_process"]}</td>
                                <td>{wu["short_description"]}</td>
                                <td className={createdColorClass}>
                                    <NumberFormat value={createdAgo} decimalScale={2} fixedDecimalScale={true} displayType={"text"} /> years
                                </td>
                                <td>{updatedAgo}</td>
                                <td>{wu["u_sdlc_phase"]}</td>
                                <td>{wu["u_sdlc_status"]}</td>
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
            return <div style={{ fontSize: "1.6vw" }}>{this.renderTable(this.state.workUnitObject.workunits)}</div>;
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Iris Work Units (Created &gt; {this.props.yearsOldThreshhold} years ago)</div>;
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
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetIrisWorkUnitListStale"
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
WidgetIrisWorkUnitListStale.defaultProps = { redThreshold: 60, amberThreshold: 50, yearsOldThreshhold: 0.9 };

// Force the caller to include the proper attributes
WidgetIrisWorkUnitListStale.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    yearsOldThreshhold: PropTypes.number,
    redThreshold: PropTypes.number,
    amberThreshold: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisWorkUnitListStale;

// =======================================================================================================
// =======================================================================================================
