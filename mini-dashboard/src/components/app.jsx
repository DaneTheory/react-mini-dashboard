import React from "react";
import CardGrid from "./cardGrid";
import unsplash from "../api/unsplash";
import WidgetSNINCP1P2Count from "./WidgetSNINCP1P2Count";
import WidgetSNUniqueLoginsToday from "./WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "./WidgetSNCurrentUsers";
import WidgetSNNewIncidentToday from "./WidgetsSNNewIncidentsToday";
import WidgetSNClicksByOS from "./WidgetsSNClicksByOS";

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
    let instance = "jnjsandbox.service-now.com";
    return (
      <div>
        <div className="title_container">
          <div className="title">Iris Dashboard</div>
        </div>

        <CardGrid rows="6" columns="6">
          <WidgetSNINCP1P2Count color="#3a5174" position="1 / 1 / span 4 / span 2" id="1" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" position="1 / 3 / span 1 / span 2" id="2" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" position="1 / 5 / span 3 / span 2" id="3" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" position="2 / 3 / span 1 / span 1" id="4" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" position="2 / 4 / span 1 / span 1" id="5" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" position="3 / 3 / span 1 / span 1" id="6" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" id="6" instance={instance} />
          <WidgetSNINCP1P2Count color="#3a5174" instance={instance} />
          <WidgetSNUniqueLoginsToday color="slategrey" instance={instance} />
          <WidgetSNCurrentUsers color="darkgreen" instance={instance} />
          <WidgetSNNewIncidentToday color="orangered" position="span 1/span 2" instance={instance} />
          <WidgetSNClicksByOS color="maroon" position="span 1/span 2" instance={instance} />
        </CardGrid>
      </div>
    );
  }
}

export default App;
