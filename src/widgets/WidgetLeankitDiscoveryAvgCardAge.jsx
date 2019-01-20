import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";

var moment = require("moment");

var classNames = require("classnames");

// Create a class component
class WidgetLeankitDiscoveryAvgCardAge extends React.Component {
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
            // check to see if collection is undefined (which likely means var wasn't popuplated in Angular yet)
            // There's a real array now, so loop through and sum the requested column
            let demand_cards = this.state.leankit_cards.filter(function(card) {
                return card.u_lanes[0].name.includes("Product Discovery");
            });

            var total = 0;
            demand_cards.forEach(function(card) {
                var startDate = moment(card.createdOn);
                var endDate = moment();
                var ageDays = startDate.diff(endDate, "days");
                var cardAgeDays = Math.abs(ageDays);
                total += cardAgeDays;
            });
            let avgCardAge = total / demand_cards.length;

            // Return JSX containing the count
            let fontColor = avgCardAge > 40 ? "redFont" : avgCardAge > 30 ? "orangeFont" : "greenFont";
            return <div className={classNames("single-num-value", fontColor)}>{avgCardAge.toFixed(2)}</div>;
        }
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitDiscoveryAvgCardAge"
            >
                <div className="single-num-title">Avg Card Age</div>
                <div className="item">{this.renderCardBody()}</div>
            </DashboardDataCard>
        );
    }

    // end of class
}

export default WidgetLeankitDiscoveryAvgCardAge;
