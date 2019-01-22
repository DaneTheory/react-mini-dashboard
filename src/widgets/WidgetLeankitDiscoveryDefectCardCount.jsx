import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";
import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

var classNames = require("classnames");

// Create a class component
class WidgetLeankitDiscoveryDefectCardCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId };
    }

    componentDidMount = async () => {
        let leankit_cards = await getLeankitCards("jnj.leankit.com", this.state.boardId, "active,backlog");
        this.setState({ leankit_cards: leankit_cards });
    };

    renderCardBody() {
        // console.log("Leankit Cards:", this.state.leankit_cards);
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            // Create list of all Demand cards, and then get a count
            let filteredCards = this.state.leankit_cards.filter(function(card) {
                return (card.customIcon && card.customIcon.title === "Defect") || card.tags.includes("Defect");
            });
            let card_count = filteredCards.length;

            // Return JSX containing the count
            let fontColor = card_count > 40 ? "redFont" : card_count > 30 ? "orangeFont" : "greenFont";
            return <div className={classNames("single-num-value", fontColor)}>{card_count}</div>;
        }
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitDiscoveryDefectCardCount"
            >
                <div className="single-num-title">Total Defect Cards</div>
                <div className="item">{this.renderCardBody()}</div>
            </DashboardDataCard>
        );
    }

    // end of class
}

// Set default props in case they aren't passed to us by the caller
WidgetLeankitDiscoveryDefectCardCount.defaultProps = {
    interval: 60
};

export default WidgetLeankitDiscoveryDefectCardCount;
