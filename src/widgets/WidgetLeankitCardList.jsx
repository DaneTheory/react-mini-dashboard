import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import { determineOSFromUserAuth } from "../utilities/determineOSFromUserAuth";
var classNames = require("classnames");

// Create a class component
class WidgetLeankitCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, leankit_cards: [], leankit_lanes: [] };
    }

    componentDidMount = async () => {
        let leankit_cards = await this.getLeankitCards("412731036");
        this.setState({ leankit_cards: leankit_cards });
    };

    renderTableRow() {}

    renderTable() {
        if (this.state.leankit_cards === []) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.8vw" }}>
                    <table>
                        <tbody>
                            {this.state.leankit_cards.map(function(card, index) {
                                let lane0 = (card.u_lanes[0] && card.u_lanes[0].name) || "No parent";
                                let lane1 = (card.u_lanes[1] && card.u_lanes[1].name) || "No parent";
                                let lane2 = (card.u_lanes[2] && card.u_lanes[2].name) || "No parent";
                                return (
                                    <tr key={card["id"]}>
                                        <td>{index}</td>
                                        <td>{card["title"]}</td>
                                        {/* <td>{card["updatedOn"]}%</td> */}
                                        <td className={classNames({ tdRed: lane0 === "No parent" })}>{lane0}</td>
                                        <td className={classNames({ tdRed: lane1 === "No parent" })}>{lane1}</td>
                                        <td className={classNames({ tdRed: lane2 === "No parent" })}>{lane2}</td>
                                        {/* <td>{("u_lanes" in card && card.u_lanes[0].name) || "No parent"}</td> */}
                                        {/* <td>{card["count"]}</td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Active Leankit Cards</div>;
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
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // ########################################################################################

    getLeankitCards = async function(boardId) {
        let startTime = new Date();

        // Load the data from the API (notice we're using the await keyword from the async framework)
        let response_cards_promise = apiProxy.get(
            `/leankit-api/${this.state.instance}/io/card?board=${boardId}&limit=600&lane_class_types=active`
        );
        let response_lanes_promise = apiProxy.get(`/leankit-api/${this.state.instance}/io/board/${boardId}`);
        // Wait for both promises to finish
        let [response_cards, response_lanes] = [await response_cards_promise, await response_lanes_promise];

        // Setup dummy entries for custom fields
        response_cards.data.cards.map(card => {
            card.u_lanes = [{}, {}, {}];
        });

        console.log(response_cards.data.cards);
        console.log(response_lanes.data.lanes);

        // Save into our component state
        this.setState({ leankit_cards: response_cards.data.cards });
        this.setState({ leankit_lanes: response_lanes.data.lanes });

        // Create an object of all lanes, indexed by lane Id
        let lanesById = {};
        response_lanes.data.lanes.map(lane => {
            lanesById[lane.id] = lane;
        });

        // Insert lane info into each card (u_ because its a custom field)
        response_cards.data.cards.map(card => {
            // Push the card's own lane
            card.u_lanes[0] = lanesById[card.lane.id];
            // Push the first parent
            card.u_lanes[1] = lanesById[lanesById[card.u_lanes[0].id].parentLaneId];
            // push the second parent
            card.u_lanes[2] = lanesById[card.u_lanes[1].parentLaneId];
        });
        console.log(response_cards.data.cards);

        let endTime = new Date();
        console.log("Time: ", Math.round(endTime - startTime));

        return response_cards.data.cards;
    };
    // end of class
}

export default WidgetLeankitCardList;
