// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getEnhancedLeankitCardObject } from "../utilities/getEnhancedLeankitCardObject";

// other imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitDiscoveryTotalCardCount extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetLeankitDiscoveryTotalCardCount",
            leankit_cards: []
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
        let leankitDataObject = await getEnhancedLeankitCardObject(this.props.leankit_instance, this.props.boardId, "active");

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ leankit_cards: leankitDataObject["listCards"] });
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

    renderCardBody() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            // Create list of all Demand cards, and then get a count
            let demand_cards = this.state.leankit_cards.filter(function(card) {
                return card.u_lanes[0].name.includes("Product Discovery");
            });
            let card_count = demand_cards.length;

            // Return JSX containing the count
            let fontColor =
                card_count >= this.props.redThreshold ? "redFont" : card_count >= this.props.amberThreshold ? "amberFont" : "greenFont";
            return <div className={classNames("single-num-value", fontColor)}>{card_count}</div>;
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
                widgetName="WidgetLeankitDiscoveryTotalCardCount"
            >
                <div className="single-num-title">Total Discovery Cards</div>
                <div
                    className="item"
                    data-tip={`Greater than ${this.props.redThreshold} is Red<br>Greater than ${this.props.amberThreshold} is Amber`}
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
WidgetLeankitDiscoveryTotalCardCount.defaultProps = {
    redThreshold: 60,
    amberThreshold: 50
};

// Force the caller to include the proper attributes
WidgetLeankitDiscoveryTotalCardCount.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired,
    redThreshold: PropTypes.number,
    amberThreshold: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitDiscoveryTotalCardCount;

// =======================================================================================================
// =======================================================================================================
