import React from "react";
import DashboardCard from "../components/DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { determineBrowserFromUserAuth } from "../utilities/determineBrowserFromUserAuth";

// Create a class component
class WidgetSNClicksByBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, browserInfo: {} };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)
        let groupby_field = "user_agent";
        apiProxy
            .get(`/sn/${this.state.instance}/api/now/stats/syslog_transaction`, {
                params: {
                    // Units for xAgoStart: years, months, days, hours, minutes
                    sysparm_query: "client_transaction=true^sys_created_on>=javascript:gs.daysAgoStart(0)",
                    sysparm_count: "true",
                    sysparm_display_value: "true",
                    sysparm_group_by: groupby_field
                }
            })
            .then(response => {
                // Restructure the ServiceNow response (somewhat deep object) into an array of simple objects
                let user_agent_strings = response.data.result.map(element => {
                    return {
                        // the brackets around [groupby_field] allow me to use a variable as a key name within the new object
                        [groupby_field]: element["groupby_fields"][0]["value"] || "<blank>",
                        count: element.stats.count
                    };
                });

                // Create an Object of counts for browser types
                let browserInfo = this.createBrowserCounts(user_agent_strings);

                // Save into our component state
                this.setState({ browserInfo: browserInfo });
            });
    };

    renderTable() {
        if (this.state.OSDict === {}) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.6vw" }}>
                    <table>
                        <tbody>
                            {Object.values(this.state.browserInfo)
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
        return <div className="single-num-title">Clicks By Browser (Today)</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
    }

    render() {
        return (
            <DashboardCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNClicksByBrowser">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardCard>
        );
    }

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

    createBrowserCounts(user_agent_table) {
        // Print out all user_agent strings for trouble-shooting
        console.log("All user_agent strings:");
        user_agent_table.forEach(row => {
            // console.log(`${row.count}: ${row.user_agent}`);
        });

        let browserCountObj = {};

        user_agent_table.forEach(element => {
            // this function is an external module which we import, see top of file
            let browserName = determineBrowserFromUserAuth(element["user_agent"]);

            // Accumulate a count of each browser
            browserCountObj[browserName] = (browserName in browserCountObj ? browserCountObj[browserName] : 0) + parseInt(element["count"]);
        });

        // Get total of all browser counts
        let browserTotal = Object.values(browserCountObj).reduce((total, num) => {
            return total + num;
        });

        // Construct Browser object with percentages
        for (const key of Object.keys(browserCountObj)) {
            browserCountObj[key] = {
                count: browserCountObj[key],
                pct: (browserCountObj[key] / browserTotal) * 100,
                name: key
            };
        }

        return browserCountObj;
    }

    // end of class
}

// Force the caller to include the proper attributes
WidgetSNClicksByBrowser.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetSNClicksByBrowser;
