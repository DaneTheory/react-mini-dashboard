import React from "react";
import DashboardCard from "./DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";

// Create a class component
class WidgetSNClicksByOS extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.instance);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, browserArray: [], OSArray: [] };
    }

    componentDidMount = async () => {
        // JSONresults = getAggregateGroupBy(currentProfile, "syslog_transaction", ["user_agent"], "sysparm_query=client_transaction=true^sys_created_on>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount))
        // (OSDict, browserDict) = analyzeBrowserResults(json.loads(JSONresults)['results'])
        // print("Content-Type: application/json\n");
        // print("{\"results\": [{\"OSResults\": %s, \"browserResults\": %s }]}" % (json.dumps(OSDict), json.dumps(browserDict)));

        // urlDetail = "/stats/%s?sysparm_count=true&sysparm_display_value=true&sysparm_group_by=%s&sysparm_limit=%s" % (str(tableName), str(groupByFields[0]), limit)

        let groupby_field = "user_agent";
        const response = await apiProxy.get(`/sn/${this.state.instance}/api/now/stats/syslog_transaction`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "client_transaction=true^sys_created_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true",
                sysparm_group_by: groupby_field
            }
        });
        console.log(response.data.result);

        console.table(response.data.result);

        let betterList = response.data.result.map(element => {
            let returnObj = {
                [groupby_field]: element["groupby_fields"][0]["value"] || "<blank>",
                count: element.stats.count
            };
            return returnObj;
        });
        console.table(betterList);
        let OSArray, browserArray;
        [OSArray, browserArray] = this.analyzeBrowserResults(betterList);

        this.setState({ OSArray: OSArray, browserArray: browserArray });
    };

    renderTable() {
        return (
            <table>
                <tbody>
                    {this.state.OSArray.map((OS, index) => (
                        <tr key={index}>
                            <td>{OS.name}</td>
                            <td>{OS.pct.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">Clicks By OS (Today)</div>
                <div style={{ fontSize: "1.6vw" }}>
                    {this.renderTable()}
                    {this.renderTable()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <DashboardCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNClicksByOS
            "
            >
                {this.renderCardBody()}
            </DashboardCard>
        );
    }

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

    analyzeBrowserResults(transTable) {
        console.warn("Beggining of ananalyze....");
        let sumTotal = 0;
        let browserDict = {};
        let OSDict = {};

        transTable.forEach(element => {
            console.log(element);

            let user_agent = element["user_agent"];

            // Default names if we can't figure out the browser and OS
            let browserName = "BrwsUnkn";
            let osName = "OSUnkn";

            // Here's what Safari looks like:
            // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0
            // Here's what chrome looks like ?
            // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2
            // Here's what Edge on Win10 looks like
            // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79
            // Here's what Firefox on Win7 looks like
            // Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0
            // Heere's what Chrome on Nougat (Android)
            // Mozilla/5.0 (Linux; Android 7.0; SAMSUNG-SM-G935A Build/NRD90M) AppleWebKit/537.36 (KHTML, like Geck

            // Here's what Native Mobile App v 3.0.0 on Samsung Galaxy S7 Edge
            // ServiceNow/3.0.0-45 (Android 24; Samsung SAMSUNG-SM-G935A)

            // Here's what Native Mobile App v 5.0 on iPhone iOS 10.3.2
            // ServiceNow/5.0 (iPhone; iOS 10.3.2; Scale/2.00)

            // Look for well-known browsers in user_agent string
            if (user_agent.includes("Macintosh") && !user_agent.includes("Chrome")) {
                browserName = "Safari";
            } else if (user_agent.includes("ServiceNow") && user_agent.includes("Android")) {
                browserName = "NativeMobile (Android)";
            } else if (user_agent.includes("ServiceNow") && user_agent.includes("iPhone iOS")) {
                browserName = "NativeMobile (iOS)";
            } else if (user_agent.includes("Pingdom")) {
                browserName = "Pingdom-bot";
            } else if (user_agent.includes("internal_soap_client")) {
                browserName = "Internal-Soap";
            } else if (user_agent.includes("Windows NT 10.0") && user_agent.includes("AppleWebKit")) {
                browserName = "Edge";
            } else if (user_agent.includes("AppleWebKit") && user_agent.includes("Android")) {
                browserName = "Chrome (Android)";
            } else if (user_agent.includes("Trident/7.0")) {
                browserName = "IE11";
            } else if (user_agent.includes("Firefox")) {
                browserName = "Firefox";
            } else if (user_agent.includes("Chrome")) {
                browserName = "Chrome";
            }

            // Look for well-known OS's in user_agent string
            if (user_agent.includes("Windows NT 6.1")) {
                osName = "Win7";
            } else if (user_agent.includes("Windows NT 6.3")) {
                osName = "Win8";
            } else if (user_agent.includes("Windows NT 10.0")) {
                osName = "Win10";
            } else if (user_agent.includes("Mac OS")) {
                osName = "MacOS";
            } else if (user_agent.includes("Android")) {
                osName = "Android";
            }

            // Now that we've found the real OS name (e.g. Win7), increment the count
            if (osName in OSDict) {
                OSDict[osName] += parseInt(element["count"]);
            } else {
                OSDict[osName] = parseInt(element["count"]);
            }

            // Now that we've found the real browser name (e.g. Chrome), increment the count
            if (browserName in browserDict) {
                browserDict[browserName] += parseInt(element["count"]);
            } else {
                browserDict[browserName] = parseInt(element["count"]);
            }

            console.log("Browser Name:", browserName);
            console.log("     OS Name:", osName);

            // -------------
        });
        // Create array of dictionaries
        let OSArray = Object.keys(OSDict).map(key => {
            console.log("key", key);
            let newDict = {};
            newDict["name"] = key;
            newDict["count"] = OSDict[key];
            newDict["pct"] = "100";
            console.log(newDict);
            return newDict;
        });
        // Create array of dictionaries
        let BrowserArray = Object.keys(browserDict).map(key => {
            console.log("key", key);
            let newDict = {};
            newDict["name"] = key;
            newDict["count"] = browserDict[key];
            newDict["pct"] = "99";
            console.log(newDict);
            return newDict;
        });

        let total = 0;
        // sum up total
        OSArray.forEach(element => {
            total = total + parseInt(element["count"]);
        });
        // calculate pct for each, based on total
        OSArray.forEach(element => {
            element["pct"] = (element["count"] / total) * 100;
        });

        total = 0;
        // sum up total
        BrowserArray.forEach(element => {
            total = total + parseInt(element["count"]);
        });
        // calculate pct for each, based on total
        BrowserArray.forEach(element => {
            element["pct"] = (element["count"] / total) * 100;
        });

        console.table(OSArray);
        console.table(BrowserArray);

        return [OSArray, BrowserArray];
    }
}

// Force the caller to include the proper attributes
WidgetSNClicksByOS.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetSNClicksByOS;
