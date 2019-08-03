// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import { getEnhancedLeankitCardObject } from "../utilities/getEnhancedLeankitCardObject";
import { getCommentsforLeankitCards } from "../utilities/getCommentsForLeankitCards";

// Additional imports
var classNames = require("classnames");
var moment = require("moment");

// helper function
function stripHtml(html) {
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitCardList extends React.Component {
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
        let leankitDataObject = await getEnhancedLeankitCardObject(this.props.leankit_instance, this.props.boardId, "active");

        // Filter down to just solutioning cards
        let filteredCards = leankitDataObject["listCards"].filter(function(card) {
            // All Discovery Cards
            return card.u_lanes[0].name.includes("Product Discovery");
        });

        // Add User comments to each card (they are not part of original call)
        let leankit_cards_with_comments = await getCommentsforLeankitCards(filteredCards, this.props.leankit_instance);

        // Get the backlog duration
        // let leankit_cards_with_backlogDuration = await getBacklogDurationForLeankitCards(filteredCards, this.props.leankit_instance);
        // console.log(leankit_cards_with_backlogDuration);

        // Put most-recent comment for each card into a special field so it's easier to find later
        leankit_cards_with_comments.forEach(function(card) {
            // Set some variables to be used in JSX below
            card.commentMostRecent = {
                Text: "Waiting for Comment",
                Author: "Waiting for Comment",
                ageInDay: "Waiting for Comment"
            };

            // If Card has a comment on it, then compute the most-recent comment (and colorize it based on age)
            if (card.comments && card.comments.length > 0 && card.comments[0].text) {
                // Remove the HTML from the comment
                card.commentMostRecent.Text = stripHtml(card.comments[0].text);
                // Truncate if needed
                const maxLength = 180;
                card.commentMostRecent.Text =
                    card.commentMostRecent.Text.slice(0, maxLength) + (card.commentMostRecent.Text.length > maxLength ? "..." : "");
                card.commentMostRecent.Author = card.comments[0].createdBy.fullName;
                card.commentMostRecent.ageInDays = moment().diff(moment(card.comments[0].createdOn), "days");
                card.commentMostRecent.className =
                    card.commentMostRecent.ageInDays > 5 ? "redFont" : card.commentMostRecent.ageInDays > 3 ? "amberFont" : "greenFont";
            } else if (card.comments && card.comments.length === 0) {
                // API call to get card comments has returned, but card doesn't have any comments
                card.commentMostRecent.Text = "No Comment";
                card.commentMostRecent.Author = "No Author";
                card.commentMostRecent.ageInDays = "-1";
            }
        });

        // Update our own component state with the new data, which will cause our component to re-render
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

    renderTable() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.8vw" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Owner</th>
                                <th>Age</th>
                                <th>Staleness</th>
                                <th>Card Type</th>
                                <th>Title</th>
                                <th>Pts</th>
                                <th>Tags</th>
                                <th>Lane</th>
                                <th>Linked Card</th>
                                <th>Comment Age</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.leankit_cards
                                .sort((a, b) => {
                                    return b.u_daysSinceCreation - a.u_daysSinceCreation;
                                })
                                .map(function(card, index) {
                                    // Set some variables to be used in JSX below
                                    let lane1 = (card.u_lanes[1] && card.u_lanes[1].name) || "No parent";
                                    let ageInDaysClass =
                                        card.u_daysSinceCreation > 80
                                            ? "redFont"
                                            : card.u_daysSinceCreation > 40
                                                ? "amberFont"
                                                : "greenFont";
                                    let owner =
                                        (card.assignedUsers && card.assignedUsers.length > 0 && card.assignedUsers[0].fullName) || "Nobody";
                                    // Now return a JSX statement for rendering
                                    return (
                                        <tr key={card["id"]}>
                                            <td>{index + 1}</td>
                                            <td>{owner}</td>
                                            <td className={ageInDaysClass}>{card.u_daysSinceCreation}</td>
                                            <td>{card.u_daysSinceUpdate}</td>
                                            <td>{card.type.title}</td>
                                            <td>
                                                <a href={card.u_url} target="_blank" rel="noreferrer noopener">
                                                    {card["title"]}
                                                </a>
                                            </td>
                                            <td>{card.size}</td>
                                            <td>{card.tags.join(",")}</td>
                                            {/* <td>{card["updatedOn"]}%</td> */}
                                            {/* <td className={classNames({ tdRed: lane0 === "No parent" })}>{lane0}</td> */}
                                            {/* <td className={classNames({ tdRed: lane1 === "No parent" })}>{lane1}</td> */}
                                            {/* <td className={classNames({ tdRed: lane2 === "No parent" })}>{lane2}</td> */}
                                            <td>{lane1}</td>
                                            <td>
                                                <a href={card.u_external_url_link} target="_blank" rel="noreferrer noopener">
                                                    {card.u_external_url_label}
                                                </a>
                                            </td>
                                            <td className={classNames(card.commentMostRecent.className)}>
                                                {card.commentMostRecent.ageInDays}
                                            </td>
                                            <td>{card.commentMostRecent.Text}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
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
                widgetName="WidgetLeankitCardList"
            >
                <div className="single-num-title">All Product Discovery Cards</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetLeankitCardList.defaultProps = {};

// Force the caller to include the proper attributes
WidgetLeankitCardList.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitCardList;

// =======================================================================================================
// =======================================================================================================
