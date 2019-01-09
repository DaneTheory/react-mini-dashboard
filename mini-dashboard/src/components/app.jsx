import React from "react";
import CardGrid from "./cardGrid";
import unsplash from "../api/unsplash";
import WidgetSNINCP1P2Count from "./WidgetSNINCP1P2Count";
import WidgetSNUniqueLoginsToday from "./WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "./WidgetSNCurrentUsers";
import WidgetSNNewIncidentToday from "./WidgetsSNNewIncidentsToday";
import WidgetSNClicksByOS from "./WidgetSNClicksByOS";
import WidgetSNClicksByBrowser from "./WidgetSNClicksByBrowser";
import WidgetBoldChatActiveCount from "./WidgetBoldChatActiveCount";
import WidgetBoldChatInactiveCount from "./WidgetBoldChatInactiveCount";
import WidgetLeankitCount from "./WidgetLeankitCount";

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
        // let instance = "jnjsandbox.service-now.com";
        let sn_instance = "jnjprodworker.service-now.com";
        let boldchat_instance = "api.boldchat.com";

        return (
            <div>
                <div className="title_container">
                    <div className="title">Iris Dashboard</div>
                </div>

                <CardGrid rows="7" columns="6">
                    <WidgetSNINCP1P2Count color="#3a5174" position="1 / 3 / span 1 / span 2" id="2" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" position="1 / 5 / span 1 / span 1" id="3" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" position="2 / 3 / span 1 / span 1" id="4" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" position="2 / 4 / span 1 / span 1" id="5" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" position="3 / 3 / span 1 / span 1" id="6" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" id="6" instance={sn_instance} />
                    <WidgetSNINCP1P2Count color="#3a5174" instance={sn_instance} />
                    <WidgetSNUniqueLoginsToday color="slategrey" instance={sn_instance} />
                    <WidgetSNCurrentUsers color="darkgreen" instance={sn_instance} />
                    <WidgetSNNewIncidentToday color="orangered" position="span 1/span 1" instance={sn_instance} />
                    <WidgetSNClicksByOS color="darkolivegreen" position="span 3/span 1" instance={sn_instance} />
                    <WidgetSNClicksByBrowser color="darkolivegreen" position="span 3/span 1" instance={sn_instance} />
                    <WidgetLeankitCount color="mediumpurple" position="span 1/span 1" instance="jnj.leankit.com" />
                    <WidgetBoldChatActiveCount color="IndianRed" position="span 1/span 1" instance={boldchat_instance} />
                    <WidgetBoldChatInactiveCount color="IndianRed" position="span 1/span 1" instance={boldchat_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default App;
