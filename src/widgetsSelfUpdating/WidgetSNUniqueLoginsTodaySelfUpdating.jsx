// 3rd party imports
import React from "react";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import ReactTimeout from "react-timeout";
import NumberFormat from "react-number-format";

// Other project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

// Create a class component
class WidgetSNUniqueLoginsTodaySelfUpdating extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        this.state = { widgetName: "WidgetSNUniqueLoginsTodaySelfUpdating", count: null };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/sys_user_presence`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });

        // Update our own state with the new data
        this.setState({ count: response.data.result.stats.count });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async updateOurData() {
        // Start timer
        let startTime = new Date();

        // This function contains the custom logic to update our own data
        await this.customUpdateFunction();

        // Check to see if we're trying to update ourselves too often
        checkForAggressiveRefreshInterval(startTime, this.props.interval, this.state.widgetName);

        // Set a timeOut to update ourselves again in refreshInterval
        this.props.setTimeout(() => {
            console.log(`${this.state.widgetName}: Updating data, interval is ${this.props.interval}s`);
            this.updateOurData();
        }, this.props.interval * 1000);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        this.updateOurData();
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    renderCardBody() {
        return (
            <div className="item">
                <div className="single-num-title">Unique Logins Today (Self Updating)</div>
                <div className="single-num-value">
                    <NumberFormat value={this.state.count} thousandSeparator={true} displayType={"text"} />
                </div>
            </div>
        );
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNUniqueLoginsTodaySelfUpdating"
            >
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetSNUniqueLoginsTodaySelfUpdating.defaultProps = {
    interval: 60
};

// Force the caller to include the proper attributes
WidgetSNUniqueLoginsTodaySelfUpdating.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    interval: PropTypes.number.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    setTimeout: PropTypes.func
};

export default ReactTimeout(WidgetSNUniqueLoginsTodaySelfUpdating);

// =======================================================================================================
// =======================================================================================================
