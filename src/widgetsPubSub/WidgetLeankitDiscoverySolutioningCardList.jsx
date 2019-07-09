// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";
import { getCommentsforLeankitCards } from "../utilities/getCommentsForLeankitCards";
import { getBacklogDurationForLeankitCards } from "../utilities/getBacklogDurationForLeankitCards";
import tractor from "./tractor.png";

// other imports
var moment = require("moment");
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitDiscoverySolutioningCardList extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { leankit_cards: [] };

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

        // Put a dummy value in for backlogDuration, we'll figure it out later
        filteredCards.forEach(card => {
            card.backlogDuration = { days: "unknown" };
        });

        // Fake alter data so we have an older card in Solutioning
        filteredCards.forEach(card => {
            if (card.title === "Fake Card for Testing") {
                card.daysInLane = 15;
            }
        });

        // Save these cards to our state, which triggers react to render an update to the screen
        this.setState({ leankit_cards: filteredCards });

        // Enrich each card by adding URL field (boardId is hard-coded)
        for (var i = 0; i < filteredCards.length; i++) {
            var card = filteredCards[i];
            card.url = `https://${this.props.leankit_instance}/card/${card.id}`;
        }

        // User comments are not part of original call, so add them now
        let leankit_cards_with_comments = await getCommentsforLeankitCards(filteredCards, this.props.leankit_instance);

        // Save these cards to our state, which triggers react to render an update to the screen
        this.setState({ leankit_cards: leankit_cards_with_comments });

        // Get the backlog duration
        let leankit_cards_with_backlogDuration = await getBacklogDurationForLeankitCards(filteredCards, this.props.leankit_instance);
        // console.log(leankit_cards_with_backlogDuration);

        // Update our own state with the new data
        this.setState({ leankit_cards: leankit_cards_with_backlogDuration });
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

    renderTableBody() {
        return (
            <tbody>
                {this.state.leankit_cards
                    .sort((a, b) => {
                        return b.daysInLane - a.daysInLane;
                    })
                    .filter(card => {
                        return card.daysInLane >= this.props.daysInLaneThreshold;
                    })
                    .map(function(card, index) {
                        // Set some variables to be used in JSX below
                        let cardOwner =
                            (card.assignedUsers && card.assignedUsers.length > 0 && card.assignedUsers[0].fullName) || "No Owner";
                        let commentMostRecentText = "Waiting for Comment";
                        let commentMostRecentAuthor = "Waiting for Comment";
                        let commentMostRecent = { ageInDays: "Waiting for Comment" };
                        let inLane = { days: card.daysInLane };
                        inLane.className = inLane.days > 14 ? "cellRed" : inLane.days > 11 ? "cellAmber" : "cellGreen";

                        if (card.comments && card.comments.length > 0 && card.comments[0].text) {
                            // Card has at least one comment
                            commentMostRecentText = card.comments[0].text;
                            commentMostRecentAuthor = card.comments[0].createdBy.fullName;
                            commentMostRecent.ageInDays = moment().diff(moment(card.comments[0].createdOn), "days");
                            commentMostRecent.className =
                                commentMostRecent.ageInDays > 5 ? "redFont" : commentMostRecent.ageInDays > 3 ? "orangeFont" : "greenFont";
                        } else if (card.comments && card.comments.length === 0) {
                            // API call to get card comments has returned, but card doesn't have any comments
                            commentMostRecentText = "No Comment";
                            commentMostRecentAuthor = "No Author";
                            commentMostRecent = { ageInDays: "-1" };
                        }

                        // Strip the html tags
                        let temporalDivElement = document.createElement("div");
                        // Set the HTML content with the providen
                        temporalDivElement.innerHTML = commentMostRecentText;
                        // Retrieve the text property of the element (cross-browser support)
                        let zeroHTML = temporalDivElement.textContent || temporalDivElement.innerText || "";
                        // Truncate the ext
                        commentMostRecentText = zeroHTML.substring(0, 200);

                        let backlogComplete = card.backlogComplete || card.createdOn;
                        let backlogDuration = moment(backlogComplete).diff(moment(card.createdOn), "days");

                        // Now return a JSX statement for rendering (remember, we're inside a .map() loop)
                        return (
                            <tr key={card["id"]}>
                                <td align="center">{index + 1}</td>
                                <td align="center" className={classNames(inLane.className)}>
                                    {cardOwner}
                                    <br />
                                    <div>{inLane.days} days</div>
                                </td>
                                <td>
                                    <a href={card.url}>{card["title"]}</a>
                                </td>
                                <td align="center" className={classNames(commentMostRecent.className)}>
                                    {commentMostRecent.ageInDays} days
                                </td>
                                <td>
                                    <b>(({commentMostRecentAuthor}))</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {commentMostRecentText}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        );
    }

    renderTable() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            // We have data(cards) now
            if (
                this.state.leankit_cards.filter(card => {
                    return card.daysInLane >= this.props.daysInLaneThreshold;
                }).length === 0
            ) {
                // Show a fun picture
                return (
                    <div style={{ display: "flex", marginTop: "2vw", justifyContent: "center" }}>
                        <div>
                            <div style={{ fontSize: "1vw" }}>
                                Way to go ! <br /> Zero Solution Cards nearing breach.
                            </div>
                            <div style={{ fontSize: "1vw", marginTop: "1vw" }}>Here&apos;s a picture of a tractor</div>
                        </div>
                        <div>
                            <img style={{ width: "12vw", margin: "0vw 2vw" }} src={tractor} alt="" />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th width="3%" />
                                    <th width="15%">
                                        Owner
                                        <br />
                                        Days in Lane
                                    </th>
                                    <th width="40%">Description</th>
                                    <th width="7%">Comment Age</th>
                                    <th width="30%">Most Recent Comment</th>
                                </tr>
                            </thead>
                            {this.renderTableBody()}
                        </table>
                    </div>
                );
            }
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
                widgetName="WidgetLeankitDiscoverySolutioningCardList"
            >
                <div className="single-num-title">Solutioning Cards Nearing Breach (Non-Project)</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetLeankitDiscoverySolutioningCardList.defaultProps = {
    daysInLaneThreshold: 0
};

// Force the caller to include the proper attributes
WidgetLeankitDiscoverySolutioningCardList.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired,
    daysInLaneThreshold: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitDiscoverySolutioningCardList;

// =======================================================================================================
// =======================================================================================================
