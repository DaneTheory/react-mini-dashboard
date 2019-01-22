import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { determineOSFromUserAuth } from "../utilities/determineOSFromUserAuth";

// Create a class component
class WidgetSNClicksByOS extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, OSInfo: {} };
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

                // Create a dictionary of counts for both browswer and OS
                let OSInfo = this.createOSCounts(user_agent_strings);

                // Save into our component state
                this.setState({ OSInfo: OSInfo });
            });
    };

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

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

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

    // end of class
}

// Force the caller to include the proper attributes
WidgetSNClicksByOS.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetSNClicksByOS;
