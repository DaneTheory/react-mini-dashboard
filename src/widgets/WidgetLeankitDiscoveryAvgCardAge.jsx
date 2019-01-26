import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";
import ReactTimeout from "react-timeout";

import { checkForAggressiveRefreshInterval } from "../utilities/checkForAggressiveRefreshInterval";

var moment = require("moment");

var classNames = require("classnames");

// Create a class component
class WidgetLeankitDiscoveryAvgCardAge extends React.Component {
    constructor(props) {
        super(props);

        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId };
    }

    async customUpdateFunction() {
        // Retrieve our data (likely from an API)
        let leankit_cards = await getLeankitCards("jnj.leankit.com", this.state.boardId, "active,backlog");

        // Update our own state with the new data
        this.setState({ leankit_cards: leankit_cards });
    }

    async updateOurData() {
        // Start timer
        let startTime = new Date();

        // This function contains the custom logic to update our own data
        await this.customUpdateFunction();

        // Check to see if we're trying to update ourselves too often
        checkForAggressiveRefreshInterval(startTime, this.props.interval, this.state.widgetName);

        // Set a timeOut to update ourselves again in refreshInterval
        this.props.setTimeout(() => {
            console.log(`${this.state.widgetName}: Updating data, interval is ${this.props.interval}s`);
            this.updateOurData();
        }, this.props.interval * 1000);
    }

    componentDidMount = async () => {
        this.updateOurData();
    };

    renderCardBody() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
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
            let fontColor = avgCardAge > 90 ? "redFont" : avgCardAge > 80 ? "orangeFont" : "greenFont";
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

// Set default props in case they aren't passed to us by the caller
WidgetLeankitDiscoveryAvgCardAge.defaultProps = {
    interval: 60
};

export default ReactTimeout(WidgetLeankitDiscoveryAvgCardAge);
