// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";

// other imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitDiscoveryOwnerList extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { leankit_cards: [], ownerArray: [] };

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

        // Filter down to just solutioning cards
        let filteredCards = leankit_cards.filter(function(card) {
            return card.u_lanes[1].name === "Solutioning" && card.u_lanes[2].name === "Non-Project WUs";
        });

        this.setState({ leankit_cards: filteredCards });
        // this.setState({ leankit_cards: leankit_cards });

        // Determine which owners have the most cards
        var ownerFrequency = {};
        var owner;
        filteredCards.forEach(function(card) {
            owner = (card.assignedUsers && card.assignedUsers.length > 0 && card.assignedUsers[0].fullName) || "Nobody";
            ownerFrequency[owner] = ownerFrequency[owner] || 0;
            ownerFrequency[owner]++;
        });
        // Convert Object where key=Name and value=count into Array of objects where name=Name and count=value
        let ownerArray = Object.entries(ownerFrequency).map(obj => {
            return { name: obj[0], count: obj[1] };
        });
        // console.log("owner array", ownerArray);

        // Update our own state with the new data
        this.setState({ ownerArray: ownerArray });
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

    renderTable() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            return (
                <table>
                    <thead>
                        <tr>
                            <th width="65%">Owner</th>
                            <th width="35%"># of cards</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ownerArray
                            .sort((a, b) => {
                                return b.count - a.count;
                            })
                            .map(function(card) {
                                // Set some variables to be used in JSX below
                                let owner = { text: card.name };
                                let cardCount = { text: card.count };
                                cardCount.className = cardCount.text > 4 ? "redFont" : cardCount.text > 1 ? "orangeFont" : "greenFont";

                                // Now return a JSX statement for rendering
                                return (
                                    <tr key={card["name"]}>
                                        <td align="center">{owner.text}</td>
                                        <td align="center" className={classNames(cardCount.className)}>
                                            {cardCount.text}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            );
        }
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
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
                widgetName="WidgetLeankitDiscoveryOwnerList"
            >
                <div className="single-num-title">Discovery Card Owner Frequency</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Force the caller to include the proper attributes
WidgetLeankitDiscoveryOwnerList.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
WidgetLeankitDiscoveryOwnerList.defaultProps = {};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitDiscoveryOwnerList;

// =======================================================================================================
// =======================================================================================================
