// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import { determineOSFromUserAuth } from "../utilities/determineOSFromUserAuth";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNClicksByOS extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetSNClicksByOS", count: [], instance: props.instance, OSInfo: {} };

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
        let groupby_field = "user_agent";
        let response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/syslog_transaction`, {
            params: {
                // Units for xAgoStart: years, months, days, hours, minutes
                sysparm_query: "client_transaction=true^sys_created_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true",
                sysparm_group_by: groupby_field
            }
        });

        // Restructure the ServiceNow response (somewhat deep object) into an array of simple objects
        let user_agent_strings = response.data.result.map(element => {
            return {
                // the brackets around [groupby_field] allow me to use a variable as a key name within the new object
                [groupby_field]: element["groupby_fields"][0]["value"] || "<blank>",
                count: element.stats.count
            };
        });

        // Create a dictionary of counts for both browswer and OS
        let OSInfo = this.createOSCounts(user_agent_strings);

        // Update our own state with the new data
        this.setState({ OSInfo: OSInfo });
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

    createOSCounts(user_agent_table) {
        // Print out all user_agent strings for trouble-shooting
        // console.log("All user_agent strings:");
        user_agent_table.forEach(row => {
            // console.log(`${row.count}: ${row.user_agent}`);
        });

        let OSCountObj = {};

        user_agent_table.forEach(element => {
            // this function is an external module which we import, see top of file
            let osName = determineOSFromUserAuth(element["user_agent"]);

            // Accumulate a count of each OS
            OSCountObj[osName] = (osName in OSCountObj ? OSCountObj[osName] : 0) + parseInt(element["count"]);
        });

        // Get total of all OS counts
        let OSTotal = Object.values(OSCountObj).reduce((total, num) => {
            return total + num;
        });

        // Construct OS object with percentages
        for (const key of Object.keys(OSCountObj)) {
            OSCountObj[key] = {
                count: OSCountObj[key],
                pct: (OSCountObj[key] / OSTotal) * 100,
                name: key
            };
        }

        return OSCountObj;
    }

    renderTable() {
        if (this.state.OSInfo === {}) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    <table>
                        <tbody>
                            {Object.values(this.state.OSInfo)
                                .sort((a, b) => {
                                    return b.pct - a.pct;
                                })
                                .map(value => (
                                    <tr key={value["name"]}>
                                        <td>{value["name"]}</td>
                                        <td>{value["pct"].toFixed(1)}%</td>
                                        {/* <td>{value["count"]}</td> */}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Clicks By OS (Today)</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
    }

    render() {
        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNClicksByOS">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Force the caller to include the proper attributes
WidgetSNClicksByOS.propTypes = {
    instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// Set default props in case they aren't passed to us by the caller
WidgetSNClicksByOS.defaultProps = {};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNClicksByOS;

// =======================================================================================================
// =======================================================================================================
