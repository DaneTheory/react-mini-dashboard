import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";

var classNames = require("classnames");

// Create a class component
class WidgetLeankitDiscoveryOwnerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId, ownerArray: [] };
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
        console.log("owner array", ownerArray);
        this.setState({ ownerArray: ownerArray });
    };

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
                            .map(function(card, index) {
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
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitDiscoveryOwnerList"
            >
                <div className="single-num-title">Owner Frequency</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // end of class
}

export default WidgetLeankitDiscoveryOwnerList;
