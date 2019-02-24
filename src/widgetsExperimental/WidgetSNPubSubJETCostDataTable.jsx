// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import NumberFormat from "react-number-format";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getJETData } from "../utilities/getJETData";

// other imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNPubSubJETCostDataTable extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        // this.state = { widgetName: "WidgetSNPubSubJETCostDataTable", consumptionUnits: { chad: { count: 42 }, fred: { count: 43 } } };
        this.state = { widgetName: "WidgetSNPubSubJETCostDataTable", JETconsumptionUnits: {} };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let JETconsumptionUnits = await getJETData(this.props.sn_instance, this.props.boldchat_instance);

        // Update our own state with the new data
        this.setState({ JETconsumptionUnits: JETconsumptionUnits });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // perform initial update of our own data
        this.getDataAndUpdateState();

        // Now listen for update request to update data by subscribing to update events
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
                            {Object.entries(this.state.JETconsumptionUnits)
                                .sort((a, b) => {
                                    // .entries() gives us an array of key/value for each object, so [1] is the value
                                    // We want to sort by the designated "order" variable in each object
                                    return a[1].order - b[1].order;
                                })
                                .map(function([key, value]) {
                                    let fontColorVariance = value.dollarVariance > 0 ? "redFont" : "greenFont";
                                    return (
                                        <tr key={key}>
                                            <td>{value.name}</td>
                                            <td align="right">
                                                <NumberFormat value={value.count} thousandSeparator={true} displayType={"text"} />
                                            </td>
                                            <td align="right">
                                                $
                                                <NumberFormat
                                                    value={value.unitCost}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    displayType={"text"}
                                                />
                                            </td>
                                            <td align="right">
                                                <NumberFormat
                                                    value={value.weeklyTargetCount}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                />
                                            </td>
                                            <td align="right">
                                                <NumberFormat value={value.pctOfTarget * 100} decimalScale={0} displayType={"text"} />%
                                            </td>
                                            <td align="right">
                                                $
                                                <NumberFormat
                                                    value={value.actualCost}
                                                    thousandSeparator={true}
                                                    decimalScale={0}
                                                    displayType={"text"}
                                                />
                                            </td>
                                            <td className={classNames(fontColorVariance)} align="right">
                                                $
                                                <NumberFormat
                                                    value={value.dollarVariance}
                                                    thousandSeparator={true}
                                                    decimalScale={0}
                                                    displayType={"text"}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
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
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNPubSubJETCostDataTable"
            >
                <div className="single-num-title">JET Cost Data Table</div>
                {this.renderCardTable()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetSNPubSubJETCostDataTable.defaultProps = {};

// Force the caller to include the proper attributes
WidgetSNPubSubJETCostDataTable.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNPubSubJETCostDataTable;

// =======================================================================================================
// =======================================================================================================
