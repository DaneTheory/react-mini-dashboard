import React from "react";
import DashboardCard from "./DashboardCard";
import WidgetNames from "./WidgetNames";
import unsplash from "../api/unsplash";
import WidgetImageNames from "./WidgetImageNames";
import WidgetServiceNowINCP1P2Count from "./WidgetServiceNowINCP1P2Count";

class App extends React.Component {
    state = {
        // we expect this to be an array, so set to empty array because that will prevent .map() null issues later
        images: []
    };

    onSearchSubmit = async term => {
        const response = await unsplash.get("https://api.unsplash.com/search/photos", {
            params: { query: "Cars" }
        });

        this.setState({ images: response.data.results });
        console.log("state images", this.state.images);
    };

    renderCardBodyTable() {
        let imageBody = [{ name: "Jane", age: "40" }, { name: "Bob", age: "41" }, { name: "Freddy", age: "42" }];

        var listOfNames = imageBody.map(function(personObj, index) {
            return (
                <tr key={index}>
                    <td>{personObj["name"]}</td>
                    <td>{personObj["age"]}</td>
                </tr>
            );
        });
        return (
            <div>
                <table>
                    <tbody>{listOfNames}</tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="title_container">
                    <div className="title">Iris Dashboard</div>
                </div>
                <div
                    className="dataCard_container"
                    style={{ gridTemplateColumns: "repeat(6,1fr)", gridTemplateRows: "repeat(6,1fr)" }}
                >
                    <WidgetServiceNowINCP1P2Count color="darkred" position="1 / 1 / span 4 / span 2" id="1" />
                    <WidgetServiceNowINCP1P2Count color="orangered" position="1 / 3 / span 1 / span 2" id="2" />
                    <WidgetServiceNowINCP1P2Count color="goldenrod" position="1 / 5 / span 3 / span 2" id="3" />
                    <WidgetServiceNowINCP1P2Count color="yellowgreen" position="2 / 3 / span 1 / span 1" id="4" />
                    <WidgetServiceNowINCP1P2Count color="darkolivegreen" position="2 / 4 / span 1 / span 1" id="5" />
                    <WidgetServiceNowINCP1P2Count position="3 / 3 / span 1 / span 1" id="6" />
                    <WidgetServiceNowINCP1P2Count color="blueviolet" id="6" />
                    <WidgetServiceNowINCP1P2Count />
                </div>
            </div>
        );
    }
}

export default App;
