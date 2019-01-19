import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";
import { determineOSFromUserAuth } from "../utilities/determineOSFromUserAuth";

// Create a class component
class WidgetLeankitCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, leankit_cards: [], leankit_lanes: [] };
    }

    componentDidMount = async () => {
        let startTime = new Date();

        // Load the data from the API (notice we're using the await keyword from the async framework)
        let response_cards = await apiProxy.get(
            `/leankit-api/${this.state.instance}/io/card?board=412731036&limit=60&lane_class_types=active`
        );

        // Setup dummy entries for custom fields
        response_cards.data.cards.map(card => {
            card.u_lanes = [{}, {}, {}];
        });

        let response_lanes = await apiProxy.get(`/leankit-api/${this.state.instance}/io/board/412731036`);
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

        // Card info
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

        this.setState({ leankit_cards: response_cards.data.cards });
    };

    renderTable() {
        if (this.state.leankit_cards === []) {
            return <div className="single-num-value">No Clicks Today :(</div>;
        } else {
            return (
                <div style={{ fontSize: "1.8vw" }}>
                    <table>
                        <tbody>
                            {this.state.leankit_cards.map((card, index) => (
                                <tr key={card["id"]}>
                                    <td>{index}</td>
                                    <td>{card["title"]}</td>
                                    {/* <td>{card["updatedOn"]}%</td> */}
                                    <td>{(card.u_lanes[0] && card.u_lanes[0].name) || "No parent"}</td>
                                    <td>{(card.u_lanes[1] && card.u_lanes[1].name) || "No parent"}</td>
                                    <td>{(card.u_lanes[2] && card.u_lanes[2].name) || "No parent"}</td>
                                    {/* <td>{("u_lanes" in card && card.u_lanes[0].name) || "No parent"}</td> */}
                                    {/* <td>{card["count"]}</td> */}
                                </tr>
                            ))}
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
    // ########################################################################################
    // ########################################################################################

    createOSCounts(user_agent_table) {
        // Print out all user_agent strings for trouble-shooting
        console.log("All user_agent strings:");
        user_agent_table.forEach(row => {
            // console.log(`${row.count}: ${row.user_agent}`);
        });

        let OSCountObj = {};

        user_agent_table.forEach(element => {
            // this function is an external module which we import, see top of file
            let osName = determineOSFromUserAuth(element["user_agent"]);

            // Accumulate a count of each OS
            OSCountObj[osName] = (osName in OSCountObj ? OSCountObj[osName] : 0) + parseInt(element["count"]);
        });

        // Get total of all OS counts
        let OSTotal = Object.values(OSCountObj).reduce((total, num) => {
            return total + num;
        });

        // Construct OS object with percentages
        for (const key of Object.keys(OSCountObj)) {
            OSCountObj[key] = {
                count: OSCountObj[key],
                pct: (OSCountObj[key] / OSTotal) * 100,
                name: key
            };
        }

        return OSCountObj;
    }

    // end of class
}

export default WidgetLeankitCardList;
