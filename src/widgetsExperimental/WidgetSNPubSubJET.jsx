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
        // this.state = { widgetName: "WidgetPubSubJET", consumptionUnits: { chad: { count: 42 }, fred: { count: 43 } } };
        this.state = { widgetName: "WidgetPubSubJET", JETconsumptionUnits: {} };

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

    async JETOnsiteSupportCombined(agoCount, agoUnits) {
        let JETOnsiteSupportClosedINC = await this.JETOnsiteSupportClosedINC(agoCount, agoUnits);
        let JETOnsiteSupportClosedTasks = await this.JETOnsiteSupportClosedTasks(agoCount, agoUnits);
        return JETOnsiteSupportClosedINC + JETOnsiteSupportClosedTasks;
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
    async boldChatAnswered(agoCount, agoUnits) {
        // var url4 = `./cgi-bin/queryLogMeIn.py?profile=${factoryProfile}&function=boldChatSummaryReport&agoUnits=${agoUnits}&agoCount=${agoCount}`;
        // Example of Getting the Report ID
        // https://api{{dataResidency}}.boldchat.com/aid/{{aid}}/data/rest/json/v1/runReport?auth={{auth}}&ReportType=0&Grouping=date&FromDate=2017-09-23T00:00:01.000Z&ToDate=2017-09-30T00:00:01.000Z&FolderID=965423669295807313
        //    FromDate=2017-09-23T00:00:01.000Z

        // Compute intial FromDate based on desired history (agoUnits and agoCount)
        let fromDateString = strftime(
            "%Y-%m-%dT%H:%M:01.000Z",
            moment()
                .subtract(parseInt(agoCount), agoUnits)
                .toDate()
        );
        // Compute the "to" date to be one hour into the future, just to be sure
        let toDateString = strftime(
            "%Y-%m-%dT%H:%M:01.000Z",
            moment()
                .add(1, "hours")
                .toDate()
        );
        let folderID = "965423669295807313";

        let responseRunReport = await apiProxy.get(`/boldchat/${this.props.boldchat_instance}/data/rest/json/v1/runReport`, {
            params: {
                ReportType: "0",
                Grouping: "date",
                FromDate: fromDateString,
                ToDate: toDateString,
                FolderID: folderID
            }
        });
        let ReportID = responseRunReport.data.Data.ReportID;

        // Get the status report that we just started. NOTE: we may need to loop a few times until it's done (goes from "running" to "success")
        let reportStatus, responseGetReport;
        do {
            responseGetReport = await apiProxy.get(`/boldchat/${this.props.boldchat_instance}/data/rest/json/v1/getReport`, {
                params: { ReportID: ReportID }
            });

            console.log(responseGetReport);
            // can be "running" or "success"
            reportStatus = responseGetReport.data.Status;
            console.log("Report Status", responseGetReport.data.Status);
        } while (reportStatus !== "success");

        let report = responseGetReport.data.Data;

        // console.log("totalClicks: ", report.Summary[1]["Value"]);
        // console.log("Unavail: ", report.Summary[2]["Value"]);
        // console.log("Blocked: ", report.Summary[3]["Value"]);
        // console.log("Abandon: ", report.Summary[4]["Value"]);
        // console.log("Unanswer: ", report.Summary[5]["Value"]);
        // console.log("Answered: ", report.Summary[6]["Value"]);

        let answeredChats = report.Summary[6]["Value"];
        return answeredChats;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async JETPortalContacts(agoCount, agoUnits) {
        // var url5 = querySetup(urlBase, query, factoryProfile, "JETPortalContacts", agoUnits, agoCount);
        // JSONResults = countRecords(currentProfile, "incident",
        // "sysparm_query=u_owned_by_group=43a8eef644e71000f9aca72b4342c01a^contact_type=self-service^sys_updated_on>=javascript:gs.%sAgoStart(%s)^sys_created_on>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount, agoUnits, agoCount))

        let globalServiceDesk = "43a8eef644e71000f9aca72b4342c01a";
        let sq1 = `u_owned_by_group=${globalServiceDesk}`;
        let sq2 = "contact_type=self-service";
        let sq3 = `sys_updated_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;
        let sq4 = `sys_created_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/incident`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: [sq1, sq2, sq3, sq4].join("^"),
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        let JETPortalContacts = parseInt(response.data.result.stats.count);
        return JETPortalContacts;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async JETGenesysCTIByLang(agoCount, agoUnits) {
        // var url6 = querySetup(urlBase, query, factoryProfile, "JETGenesysCTIByLang", agoUnits, agoCount);
        // JSONResults = getAggregateGroupBy(currentProfile, "u_genesys_cti_log", ["u_language"], "sysparm_query=sys_created_on>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount))

        let groupby_field = "u_language";
        let response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/u_genesys_cti_log`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: `sys_created_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`,
                sysparm_count: "true",
                sysparm_display_value: "true",
                sysparm_group_by: groupby_field
            }
        });

        // Restructure the ServiceNow response (somewhat deep object) into an array of simple objects
        let languageCounts = response.data.result.map(element => {
            return {
                // the brackets around [groupby_field] allow me to use a variable as a key name within the new object
                [groupby_field]: element["groupby_fields"][0]["value"] || "<blank>",
                count: element.stats.count
            };
        });

        // Parse information about all Genesys Phone Call Languages
        let voiceConsumptionUnits = {};
        languageCounts.forEach((record, index) => {
            // console.log("record", record);
            var consumptionUnit = "";

            var lang = record["u_language"];
            var count = parseInt(record["count"]);
            // console.log("lang", lang);
            if (["GERMAN", "FRENCH", "DUTCH", "RUSSIAN", "ITALIAN"].includes(lang)) {
                consumptionUnit = "VoiceEMEA";
            } else if (["SPANISH", "PORTUGUESE", "CANADIAN"].includes(lang)) {
                consumptionUnit = "VoiceLATAM";
            } else if (["JAPANESE", "MANDARIN", "KOREAN"].includes(lang)) {
                consumptionUnit = "VoiceASPAC";
            } else if (["ENGLISH"].includes(lang)) {
                consumptionUnit = "VoiceEnglish";
            } else {
                console.warn("Error, lang wasn't found: " + lang);
                consumptionUnit = "Voice (Unknown)";
            }

            // Accumulate an object which has the sum counts of each voice consumption unit
            voiceConsumptionUnits[consumptionUnit] = voiceConsumptionUnits.hasOwnProperty(consumptionUnit)
                ? voiceConsumptionUnits[consumptionUnit] + count
                : count;
        });
        return voiceConsumptionUnits;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async getJETData() {
        let JETOnsiteSupport = await this.JETOnsiteSupportCombined("168", "hours");
        let JETRemoteResolutionINC = await this.JETRemoteResolutionINC("168", "hours");
        let boldChatAnswered = await this.boldChatAnswered("168", "hours");
        let JETPortalContacts = await this.JETPortalContacts("168", "hours");
        let voiceConsumptionUnits = await this.JETGenesysCTIByLang("168", "hours");

        console.log("JETOnsiteSupport", JETOnsiteSupport);
        console.log("JETRemoteResolutionINC", JETRemoteResolutionINC);
        console.log("boldChatAnswered", boldChatAnswered);
        console.log("JETPortalContacts", JETPortalContacts);
        console.log("voiceConsumptionUnits", voiceConsumptionUnits);

        let JETconsumptionUnits = {
            JETOnsiteSupport: {
                name: "Onsite Support",
                count: JETOnsiteSupport,
                unitCost: 95.0,
                weeklyTargetCount: 5536
            },
            JETRemoteResolutionINC: { name: "Remote Resolution", count: JETRemoteResolutionINC, unitCost: 25.58, weeklyTargetCount: 1299 },
            JETchatContact: { name: "Chat Contact", count: boldChatAnswered, unitCost: 4.64, weeklyTargetCount: 10277 },
            JETPortalContacts: { name: "Portal Contact", count: JETPortalContacts, unitCost: 4.64, weeklyTargetCount: 4304 },
            VoiceEMEA: { name: "Voice (EMEA)", count: voiceConsumptionUnits["VoiceEMEA"], unitCost: 24.86, weeklyTargetCount: 1901 },
            VoiceASPAC: { name: "Voice (ASPAC)", count: voiceConsumptionUnits["VoiceASPAC"], unitCost: 10.54, weeklyTargetCount: 2288 },
            VoiceLATAM: { name: "Voice (LATAM)", count: voiceConsumptionUnits["VoiceLATAM"], unitCost: 9.44, weeklyTargetCount: 1443 },
            VoiceEnglish: { name: "Voice (English)", count: voiceConsumptionUnits["VoiceEnglish"], unitCost: 6.25, weeklyTargetCount: 4525 }
        };
        // Object.entries(voiceConsumptionUnits).forEach(([key, value]) => {
        //     console.log(key, value);
        //     JETconsumptionUnits[key] = { count: value };
        // });
        return JETconsumptionUnits;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let JETconsumptionUnits = await this.getJETData();

        // Update our own state with the new data
        this.setState({ JETconsumptionUnits: JETconsumptionUnits });
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

    renderCardTable() {
        if (this.state.OSInfo === {}) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Cnt</th>
                                <th>Unit$</th>
                                <th>Wkly Tgt</th>
                                <th>Pct</th>
                                <th>Actual $</th>
                                <th>Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* This uses destructuring to unpack the result of .entries() into key/value */}
                            {Object.entries(this.state.JETconsumptionUnits).map(([key, value]) => (
                                <tr key={key}>
                                    <td>{value.name}</td>
                                    <td>
                                        <NumberFormat value={value.count} thousandSeparator={true} displayType={"text"} />
                                    </td>
                                    <td>{value.unitCost}</td>
                                    <td>
                                        <NumberFormat value={value.weeklyTargetCount} thousandSeparator={true} displayType={"text"} />
                                    </td>
                                    <td>Pct</td>
                                    <td>Actual</td>
                                    <td>Variance</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetPubSubJET">
                <div className="single-num-title">JET Data</div>
                {this.renderCardTable()}
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
