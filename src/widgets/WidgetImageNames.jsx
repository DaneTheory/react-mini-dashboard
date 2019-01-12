import React from "react";
import DashboardCard from "../components/DashboardCard";
import unsplash from "../api/unsplash";

// Create a widget class ----
class WidgetImageNames extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget", images: [] };
    }

    componentDidMount = async () => {
        const response = await unsplash.get("https://api.unsplash.com/search/photos", {
            params: { query: "Cars" }
        });
        this.setState({ images: response.data.results });
    };

    renderCardBody() {
        var listOfNames = this.state.images.map(function(imageObject, index) {
            return (
                <tr key={index}>
                    <td>{imageObject["id"]}</td>
                    <td>{imageObject["description"]}</td>
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
        return <DashboardCard widgetName="WidgetImageNames">{this.renderCardBody()}</DashboardCard>;
    }
}

export default WidgetImageNames;
