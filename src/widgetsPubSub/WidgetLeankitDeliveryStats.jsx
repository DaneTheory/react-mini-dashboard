// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import DashboardDataCard from "../components/DashboardDataCard";

// project imports
import { getLeankitCards } from "../utilities/getLeankitCards";
import { createLeankitDataObject } from "../utilities/createLeankitDataObject";

// other imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitDeliveryStats extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetLeankitDeliveryStats",
            chartData: {},
            leankitDataObject: { listCards: {} }
        };

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
        // Get all the leankit cards
        let leankit_cards = await getLeankitCards(this.props.leankit_instance, this.props.boardId, "active,backlog");

        // Save these cards to our state, which triggers react to render an update to the screen
        this.setState({ leankit_cards: leankit_cards });

        let leankitDataObject = createLeankitDataObject(leankit_cards, this.props.boardId);
        this.setState({ leankitDataObject: leankitDataObject });
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

        let styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        if (!this.state.leankitDataObject.leankitStats) {
            return (
                <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="Loading data">
                    <div>Loading Data...</div>
                </DashboardDataCard>
            );
        } else {
            // We've got data, so load the chart now
            return (
                <DashboardDataCard
                    id={this.props.id}
                    position={this.props.position}
                    color={this.props.color}
                    widgetName="WidgetLeankitDiscoveryTotalCardCount"
                >
                    <div className="single-num-title">Leankit Stats</div>
                    <br />
                    <div className="Font13x">Planned: {this.state.leankitDataObject.totalPlannedPoints} points</div>
                    <div className="Font13x">Unplanned: {this.state.leankitDataObject.totalUnplannedPoints} points</div>
                    <br />
                    <table>
                        <tbody>
                            {this.state.leankitDataObject.leankitStats.map(function(leankitStat) {
                                // Now return a JSX statement for rendering
                                let cellColor = null;
                                if (leankitStat["name"] === "Early Win %") {
                                    let earlyWinPct = parseFloat(leankitStat["stat"]);
                                    cellColor = earlyWinPct < 25 ? "cellRed" : earlyWinPct < 15 ? "cellAmber" : "cellGreen";
                                }
                                return (
                                    <tr key={leankitStat["name"]}>
                                        <td>{leankitStat["name"]}</td>
                                        <td className={classNames(cellColor)}>{leankitStat["stat"]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </DashboardDataCard>
            );
        }
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetLeankitDeliveryStats.defaultProps = {};

// Force the caller to include the proper attributes
WidgetLeankitDeliveryStats.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitDeliveryStats;

// =======================================================================================================
// =======================================================================================================
