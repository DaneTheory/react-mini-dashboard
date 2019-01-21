import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
import { getLeankitCards } from "../utilities/getLeankitCards";

var classNames = require("classnames");

// Create a class component
class WidgetLeankitCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { instance: props.instance, leankit_cards: [], boardId: props.boardId };
    }

    componentDidMount = async () => {
        let leankit_cards = await getLeankitCards("jnj.leankit.com", this.state.boardId, "active,backlog");
        this.setState({ leankit_cards: leankit_cards });
    };

    renderTable() {
        if (this.state.leankit_cards.length === 0) {
            return <div className="waiting-for-data">Waiting for data...</div>;
        } else {
            return (
                <div style={{ fontSize: "1.8vw" }}>
                    <table>
                        <tbody>
                            {this.state.leankit_cards.map(function(card, index) {
                                // Set some variables to be used in JSX below
                                let lane0 = (card.u_lanes[0] && card.u_lanes[0].name) || "No parent";
                                let lane1 = (card.u_lanes[1] && card.u_lanes[1].name) || "No parent";
                                let lane2 = (card.u_lanes[2] && card.u_lanes[2].name) || "No parent";
                                // Now return a JSX statement for rendering
                                return (
                                    <tr key={card["id"]}>
                                        <td>{index + 1}</td>
                                        <td>{card["title"]}</td>
                                        {/* <td>{card["updatedOn"]}%</td> */}
                                        <td className={classNames({ tdRed: lane0 === "No parent" })}>{lane0}</td>
                                        <td className={classNames({ tdRed: lane1 === "No parent" })}>{lane1}</td>
                                        <td className={classNames({ tdRed: lane2 === "No parent" })}>{lane2}</td>
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
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetLeankitCardList"
            >
                <div className="single-num-title">Active Leankit Cards</div>
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // end of class
}

export default WidgetLeankitCardList;
