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
class WidgetIrisWUStaleList extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetIrisWUStaleList", wuArray: [], workUnitObject: { workunits: [] } };

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

        let daysOld = 365;
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

        // Update our own state with the new data
        let workUnitObject = {};
        workUnitObject["daysOld"] = daysOld;
        workUnitObject["workunits"] = response_wu.data.result;
        this.setState({ workUnitObject: workUnitObject });
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

    renderAllTables() {
        if (this.state.wuArray.length === 0) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            return <div style={{ fontSize: "1.6vw" }}>{this.renderTable(this.state.workUnitObject.workunits)}</div>;
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Old Iris Work Units</div>;
    }

    renderCardBody() {
        let count = this.state.wuArray.length;
        let countColorClass = count > 50 ? "redFont" : count > 30 ? "orangeFont" : "greenFont";
        return <div className={classNames("item", "Font20x", countColorClass)}>{count}</div>;
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
                widgetName="WidgetIrisWUStaleList"
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
WidgetIrisWUStaleList.defaultProps = {};

// Force the caller to include the proper attributes
WidgetIrisWUStaleList.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisWUStaleList;

// =======================================================================================================
// =======================================================================================================
