// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getEnhancedLeankitCardObject } from "../utilities/getEnhancedLeankitCardObject";
import { getCommentsforLeankitCards } from "../utilities/getCommentsForLeankitCards";

// other imports
var moment = require("moment");
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitBlockedCards extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { leankit_cards: null };

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
        let leankitDataObject = await getEnhancedLeankitCardObject(this.props.leankit_instance, this.props.boardId, "active,backlog");

        // Filter down to just solutioning cards
        let filteredCards = leankitDataObject["listCardsIsHuddle"];
        console.log("Blocked Cards", filteredCards);

        // User comments are not part of original call, so add them now
        let leankit_cards_with_comments = await getCommentsforLeankitCards(filteredCards, this.props.leankit_instance);

        // Get the backlog duration
        // let leankit_cards_with_backlogDuration = await getBacklogDurationForLeankitCards(filteredCards, this.props.leankit_instance);
        // console.log(leankit_cards_with_backlogDuration);

        leankit_cards_with_comments.forEach(function(card) {
            // Set some variables to be used in JSX below
            card.u_commentMostRecent = {
                Text: "Waiting for Comment",
                Author: "Waiting for Comment",
                ageInDay: "Waiting for Comment"
            };

            // If Card has a comment on it, then compute the most-recent comment (and colorize it based on age)
            if (card.comments && card.comments.length > 0 && card.comments[0].text) {
                card.u_commentMostRecent.Text = card.comments[0].text;
                card.u_commentMostRecent.Author = card.comments[0].createdBy.fullName;
                card.u_commentMostRecent.ageInDays = moment().diff(moment(card.comments[0].createdOn), "days");
                card.u_commentMostRecent.className =
                    card.u_commentMostRecent.ageInDays > 5
                        ? "redFont"
                        : card.u_commentMostRecent.ageInDays > 3
                            ? "orangeFont"
                            : "greenFont";
            } else if (card.comments && card.comments.length === 0) {
                // API call to get card comments has returned, but card doesn't have any comments
                card.u_commentMostRecent.Text = "No Comment";
                card.u_commentMostRecent.Author = "No Author";
                card.u_commentMostRecent.ageInDays = "-1";
            }
        });

        // // Save these cards to our state, which triggers react to render an update to the screen
        this.setState({ leankit_cards: leankit_cards_with_comments });
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
                        return a.u_daysRemainingUntilBreach - b.u_daysRemainingUntilBreach;
                    })
                    .map(function(card, index) {
                        // Strip the html tags
                        let temporalDivElement = document.createElement("div");
                        // Set the HTML content with the providen
                        temporalDivElement.innerHTML = card.u_commentMostRecent.Text;
                        // Retrieve the text property of the element (cross-browser support)
                        let zeroHTML = temporalDivElement.textContent || temporalDivElement.innerText || "";
                        // Truncate the ext
                        card.u_commentMostRecent.Text = zeroHTML.substring(0, 200);

                        // let backlogComplete = card.backlogComplete || card.createdOn;
                        // let backlogDuration = moment(backlogComplete).diff(moment(card.createdOn), "days");

                        // Now return a JSX statement for rendering (remember, we're inside a .map() loop)
                        return (
                            <tr key={card["id"]}>
                                <td align="center">{index + 1}</td>
                                <td align="center" className={classNames(card.u_cssClassName)}>
                                    <div>{card.u_cardOwner}</div>
                                    <div>{card.u_cardType}</div>
                                    <div>{card.u_daysInLane} days in Lane</div>
                                </td>
                                <td>{card.u_daysSinceCreation} days</td>
                                <td>
                                    <a href={card.u_url} target="_blank" rel="noreferrer noopener">
                                        {card["title"]}
                                    </a>
                                </td>
                                <td align="center" className={classNames(card.u_commentMostRecent.className)}>
                                    {card.u_commentMostRecent.ageInDays} days
                                </td>
                                <td>
                                    <b>(({card.u_commentMostRecent.Author}))</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                    {card.u_commentMostRecent.Text}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        );
    }

    renderTable() {
        if (this.state.leankit_cards === null) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">No Cards</div>;
        } else {
            // We have data(cards) now
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
                                <th width="7%">
                                    Card
                                    <br />
                                    Age
                                </th>
                                <th width="25%">Description</th>
                                <th width="7%">Comment Age</th>
                                <th width="43%">Most Recent Comment</th>
                            </tr>
                        </thead>
                        {this.renderTableBody()}
                    </table>
                </div>
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
                widgetName="WidgetLeankitBlockedCards"
            >
                <div className="single-num-title">Huddle Cards</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetLeankitBlockedCards.defaultProps = {
    showCardsWithThisManyDaysRemaining: 0
};

// Force the caller to include the proper attributes
WidgetLeankitBlockedCards.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired,
    showCardsWithThisManyDaysRemaining: PropTypes.number
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitBlockedCards;

// =======================================================================================================
// =======================================================================================================
