import React from "react";
import DashboardCard from "./DashboardCard";
import unsplash from "../api/unsplash";

// Create a widget class ----
class WidgetNames extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget", images: [] };
    }

    componentDidMount = async () => {
        const response = await unsplash.get("https://api.unsplash.com/search/photos", {
            params: { query: "Cars" }
        });

        this.setState({ images: response.data.results });
        console.log("state images", this.state.images);
    };

    renderCardBody() {
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
                <h1>Hi</h1>
            </div>
        );
    }

    render() {
        return <DashboardCard widgetName="WidgetNames">{this.renderCardBody()}</DashboardCard>;
    }
}

export default WidgetNames;
