// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// These have to be after imports
var strftime = require("strftime");
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetPubSubJET extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetPubSubJET", count: null };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async JETOnsiteSupportClosedINC(agoCount, agoUnits) {
        // var url1 = querySetup(urlBase, query, factoryProfile, "JETOnsiteSupportClosedINC", agoUnits, agoCount);
        //   sq1 = "sysparm_query=u_resolved_by_group=d5f37b8d0a0a3c5f01ddc2e63933dd51^ORu_resolved_by_group=d5f37b800a0a3c5f00ba3dabf02d7997^ORu_resolved_by_group=e6c3f57ea9aa2c04705be10945347396^contact_type!=Bright Red^contact_type!=Bright Red PT"
        //   sq2 = "^closed_at>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount)

        // JETOnsiteSupportClosedINC
        let desksideServicesL2 = "d5f37b8d0a0a3c5f01ddc2e63933dd51";
        let LMW = "d5f37b800a0a3c5f00ba3dabf02d7997";
        let feetOnTheStreet = "e6c3f57ea9aa2c04705be10945347396";
        let sq1 = `u_resolved_by_group=${desksideServicesL2}^ORu_resolved_by_group=${LMW}^ORu_resolved_by_group=${feetOnTheStreet}`;
        let sq2 = "contact_type!=Bright Red^contact_type!=Bright Red PT";
        let sq3 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/incident`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: [sq1, sq2, sq3].join("^"),
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        let JETOnsiteSupportClosedINC = parseInt(response.data.result.stats.count);
        return JETOnsiteSupportClosedINC;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async JETOnsiteSupportClosedTasks(agoCount, agoUnits) {
        // var url2 = querySetup(urlBase, query, factoryProfile, "JETOnsiteSupportClosedTasks", agoUnits, agoCount);
        //   "sysparm_query=assignment_group=d5f37b8d0a0a3c5f01ddc2e63933dd51^ORassignment_group=d5f37b800a0a3c5f00ba3dabf02d7997^ORassignment_group=e6c3f57ea9aa2c04705be10945347396^closed_at>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount))

        // JETOnsiteSupportClosedTasks
        let desksideServicesL2 = "d5f37b8d0a0a3c5f01ddc2e63933dd51";
        let LMW = "d5f37b800a0a3c5f00ba3dabf02d7997";
        let feetOnTheStreet = "e6c3f57ea9aa2c04705be10945347396";
        let sq1 = `assignment_group=${desksideServicesL2}^ORassignment_group=${LMW}^ORassignment_group=${feetOnTheStreet}`;
        let sq2 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/sc_task`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: [sq1, sq2].join("^"),
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        let JETOnsiteSupportClosedTasks = parseInt(response.data.result.stats.count);
        return JETOnsiteSupportClosedTasks;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async JETRemoteResolutionINC(agoCount, agoUnits) {
        // var url3 = querySetup(urlBase, query, factoryProfile, "JETRemoteResolutionINC", agoUnits, agoCount);
        // JSONResults = countRecords(currentProfile, "incident",
        // "sysparm_query=u_resolved_by_group=ed43150ba92e6c04705be109453473ee^closed_at>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount))

        let RCC = "ed43150ba92e6c04705be109453473ee";
        let sq1 = `u_resolved_by_group=${RCC}`;
        let sq2 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/incident`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: [sq1, sq2].join("^"),
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        let JETRemoteResolutionINC = parseInt(response.data.result.stats.count);
        return JETRemoteResolutionINC;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async boldChatSummaryReport(agoUnits, agoCount) {
        // runReport is authorized in the new proxy API
        // Example of Getting the Report ID
        // https://api{{dataResidency}}.boldchat.com/aid/{{aid}}/data/rest/json/v1/runReport?auth={{auth}}&ReportType=0&Grouping=date&FromDate=2017-09-23T00:00:01.000Z&ToDate=2017-09-30T00:00:01.000Z&FolderID=965423669295807313
        //    FromDate=2017-09-23T00:00:01.000Z

        // Compute intial FromDate based on desired history (agoUnits and agoCount)
        var now = moment();
        let fromDateString = strftime("%Y-%m-%dT%H:%M:01.000Z", now.subtract(parseInt(agoCount), agoUnits).toDate());
        console.log(fromDateString);
        let toDate = "toDate";
        let folderID = "965423669295807313";

        const response = await apiProxy.get(`/boldchat/${this.props.boldchat_instance}/data/rest/json/v1/runReport`, {
            params: {
                ReportType: "0",
                Grouping: "date",
                FromDate: fromDateString,
                ToDate: toDate,
                FolderID: folderID
            }
        });
        console.log(response);

        // getReport same
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async JETPortalContacts() {}
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async JETGenesysCTIByLang() {}
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // var url4 = `./cgi-bin/queryLogMeIn.py?profile=${factoryProfile}&function=boldChatSummaryReport&agoUnits=${agoUnits}&agoCount=${agoCount}`;
        // var url5 = querySetup(urlBase, query, factoryProfile, "JETPortalContacts", agoUnits, agoCount);
        // var url6 = querySetup(urlBase, query, factoryProfile, "JETGenesysCTIByLang", agoUnits, agoCount);

        let JETOnsiteSupportClosedINC = await this.JETOnsiteSupportClosedINC("168", "hours");
        let JETOnsiteSupportClosedTasks = await this.JETOnsiteSupportClosedTasks("168", "hours");
        let JETRemoteResolutionINC = await this.JETRemoteResolutionINC("168", "hours");
        let boldChatSummaryReport = await this.boldChatSummaryReport("168", "hours");

        console.log("JETOnsiteSupportClosedINC", JETOnsiteSupportClosedINC);
        console.log("JETOnsiteSupportClosedTasks", JETOnsiteSupportClosedTasks);
        console.log("JETRemoteResolutionINC", JETRemoteResolutionINC);

        // Update our own state with the new data
        this.setState({ count: JETOnsiteSupportClosedINC + JETOnsiteSupportClosedTasks });
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

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetPubSubJET">
                <div className="single-num-title">JET Data</div>
                <div className="single-num-value">
                    <NumberFormat value={this.state.count} thousandSeparator={true} displayType={"text"} />
                </div>
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetPubSubJET.defaultProps = {};

// Force the caller to include the proper attributes
WidgetPubSubJET.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetPubSubJET;

// =======================================================================================================
// =======================================================================================================
