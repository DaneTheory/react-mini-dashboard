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
            <div className="ui container" style={{ marginTop: "10px" }}>
                <DashboardCard widgetName="Widget Numero Uno">{this.renderCardBodyTable()}</DashboardCard>
                <WidgetNames />
                <WidgetImageNames />
                <WidgetServiceNowINCP1P2Count />
                <br />
                <br />
                <button className="ui green basic button" onClick={this.onSearchSubmit}>
                    Button
                </button>
            </div>
        );
    }
}

export default App;
