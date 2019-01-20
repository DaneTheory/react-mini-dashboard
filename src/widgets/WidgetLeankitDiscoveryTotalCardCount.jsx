import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";

var classNames = require("classnames");

// Create a class component
class WidgetLeankitDiscoveryTotalCardCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId };
    }

    componentDidMount = async () => {
        let leankit_cards = await getLeankitCards("jnj.leankit.com", this.state.boardId, "active,backlog");
        this.setState({ leankit_cards: leankit_cards });
    };

    renderCardBody() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="single-num-value">Waiting for data...</div>;
        } else {
            // Create list of all Demand cards, and then get a count
            let demand_cards = this.state.leankit_cards.filter(function(card) {
                return card.u_lanes[0].name.includes("Product Discovery");
            });
            let card_count = demand_cards.length;

            // Return JSX containing the count
            let fontColor = card_count > 54 ? "redFont" : card_count > 50 ? "orangeFont" : "greenFont";
            return <div className={classNames("single-num-value", fontColor)}>{card_count}</div>;
        }
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitDiscoveryTotalCardCount"
            >
                <div className="single-num-title">Total Discovery Cards</div>
                <div className="item">{this.renderCardBody()}</div>
            </DashboardDataCard>
        );
    }

    // end of class
}

export default WidgetLeankitDiscoveryTotalCardCount;
