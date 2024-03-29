// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// Additional imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetIrisINCBreachSLACount extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetIrisINCBreachSLACount",
            wuArray: [],
            irisResolvedINCCount: null,
            irisResolvedINCBreachedCount: null
        };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async getDataIrisINCClosedThisMonth(additional_sysparm_query) {
        let grpTSRRTCS = "e6b0cfa0db1bd780d67644303996197c";
        let grpIrisL2 = "ad8064fd5bcd2000d5a0113d2c425417";

        let irisCI = "a702870c5bad6000705b113d2c4254ca";
        let sq1 = "sys_updated_on>=javascript:gs.beginningOfLast60Days()";
        let sq2 = `cmdb_ci=${irisCI}`;
        let sq3 = `assignment_group=${grpIrisL2}^ORassignment_group=${grpTSRRTCS}`;
        let sq4 = "u_stateIN800,900";
        let sq5 = "u_resolved_atONThis month@javascript:gs.beginningOfThisMonth()@javascript:gs.endOfThisMonth()";

        // Get count of closed/resolved INC's this month
        const response_closedINC = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/incident`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: [sq1, sq2, sq3, sq4, sq5, additional_sysparm_query].join("^"),
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });
        let INCCount_closed = parseInt(response_closedINC.data.result.stats.count);
        return INCCount_closed;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Get all tickets resolved/closed this month
        let INCCount_closed = await this.getDataIrisINCClosedThisMonth();
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ irisResolvedINCCount: INCCount_closed });

        // Get incidents breached this month (excluding tickets that have blank breach codes, Recieved breached, or Late Assignment)
        let INCCount_breached = await this.getDataIrisINCClosedThisMonth(
            "u_breached_reason_code!=^u_breached_reason_code!=Received Breached^u_breached_reason_code!=Late Assignment"
        );

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ irisResolvedINCBreachedCount: INCCount_breached });
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

    renderCardHeader() {
        return <div className="single-num-title">Iris L2 SLA (Month)</div>;
    }

    renderCardBody() {
        if (this.state.irisResolvedINCBreachedCount === null) {
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            let INCMetSLA = 100 - (this.state.irisResolvedINCBreachedCount / this.state.irisResolvedINCCount) * 100;
            // let INCMetSLAColor = "redFont";
            let INCMetSLAColor =
                INCMetSLA <= this.props.redThreshold ? "redFont" : INCMetSLA <= this.props.amberThreshold ? "amberFont" : "greenFont";
            return (
                <div>
                    <div className={classNames(INCMetSLAColor, "Font17x")}>
                        <NumberFormat value={INCMetSLA} decimalScale={2} fixedDecimalScale={true} displayType={"text"} />%
                    </div>
                    <div className="Font9x">
                        Resolved: {this.state.irisResolvedINCCount} / Breached: {this.state.irisResolvedINCBreachedCount}
                    </div>
                </div>
            );
        }
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
                widgetName="WidgetIrisINCBreachSLACount"
            >
                {this.renderCardHeader()}
                {/* data-tip is a pop-up tooltip to show how we pick colors */}
                <div
                    className="item"
                    data-tip={`Less than ${this.props.redThreshold} is Red<br>Less than ${this.props.amberThreshold} is Amber`}
                >
                    {this.renderCardBody()}
                </div>
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetIrisINCBreachSLACount.defaultProps = {
    redThreshold: 10,
    amberThreshold: 6
};

// Force the caller to include the proper attributes
WidgetIrisINCBreachSLACount.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    redThreshold: PropTypes.number,
    amberThreshold: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisINCBreachSLACount;

// =======================================================================================================
// =======================================================================================================
