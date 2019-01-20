import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";
import { getCommentsforLeankitCards } from "../utilities/getCommentsForLeankitCards";

var moment = require("moment");

var classNames = require("classnames");

// Create a class component
class WidgetLeankitCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId };
    }

    componentDidMount = async () => {
        // Get all the leankit cards
        let leankit_cards = await getLeankitCards("jnj.leankit.com", this.state.boardId, "active,backlog");

        // Filter down to just solutioning cards
        let filteredCards = leankit_cards.filter(function(card) {
            return card.u_lanes[1].name === "Solutioning" && card.u_lanes[2].name === "Non-Project WUs";
        });

        this.setState({ leankit_cards: filteredCards });
        // this.setState({ leankit_cards: leankit_cards });

        // User comments are not part of original call, so add them now
        let leankit_cards_with_comments = await getCommentsforLeankitCards(filteredCards, "jnj.leankit.com");
        // let leankit_cards_with_comments = await getCommentsforLeankitCards(leankit_cards, "jnj.leankit.com");

        this.setState({ leankit_cards: leankit_cards_with_comments });
    };

    renderTable() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="single-num-value">Waiting for data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.8vw" }}>
                    <table>
                        <tbody>
                            {this.state.leankit_cards
                                .sort((a, b) => {
                                    return b.daysInLane - a.daysInLane;
                                })
                                .map(function(card, index) {
                                    // Set some variables to be used in JSX below
                                    let cardOwner =
                                        (card.assignedUsers && card.assignedUsers.length > 0 && card.assignedUsers[0].fullName) ||
                                        "No Owner";
                                    let commentMostRecentText = "Waiting for Comment";
                                    let commentMostRecentAuthor = "Waiting for Comment";
                                    let commentMostRecent = { ageInDays: "Waiting for Comment" };

                                    if (card.comments && card.comments.length > 0 && card.comments[0].text) {
                                        commentMostRecentText = card.comments[0].text;
                                        commentMostRecentAuthor = card.comments[0].createdBy.fullName;
                                        commentMostRecent.ageInDays = moment().diff(moment(card.comments[0].createdOn), "days");
                                        commentMostRecent.className =
                                            commentMostRecent.ageInDays > 5
                                                ? "redFont"
                                                : commentMostRecent.ageInDays > 3
                                                ? "orangeFont"
                                                : "greenFont";
                                    }

                                    // Strip the html tags
                                    let temporalDivElement = document.createElement("div");
                                    // Set the HTML content with the providen
                                    temporalDivElement.innerHTML = commentMostRecentText;
                                    // Retrieve the text property of the element (cross-browser support)
                                    let zeroHTML = temporalDivElement.textContent || temporalDivElement.innerText || "";
                                    // Truncate the ext
                                    commentMostRecentText = zeroHTML.substring(0, 200);

                                    // Now return a JSX statement for rendering
                                    return (
                                        <tr key={card["id"]}>
                                            <td>{index + 1}</td>
                                            <td>{cardOwner}</td>
                                            <td>{card.daysInLane} days</td>
                                            <td>{card["title"]}</td>
                                            <td className={classNames(commentMostRecent.className)}>{commentMostRecent.ageInDays} days</td>
                                            <td>
                                                <b>(({commentMostRecentAuthor}))</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {commentMostRecentText}
                                            </td>
                                        </tr>

                                        // var ageDays = startDate.diff(endDate, "days");
                                        // var cardAgeDays = Math.abs(ageDays);
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
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitCardList"
            >
                <div className="single-num-title">Solutioning Cards (Non-Project)</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // end of class
}

export default WidgetLeankitCardList;
