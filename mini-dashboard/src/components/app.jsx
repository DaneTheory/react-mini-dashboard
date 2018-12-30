import React from "react";
import Widget from "./Widget";

class App extends React.Component {
    state = {
        name: ""
    };

    render() {
        // let imageBody = "Big image body, here's some more text";
        let imageBody = ["Jane", "Bob", "Freddy"];
        return (
            <div className="ui container" style={{ marginTop: "10px" }}>
                App
                <br />
                <button className="ui green basic button">Button</button>
                <Widget
                    widgetName="inbound widget name"
                    widgetBody={imageBody}
                />
            </div>
        );
    }
}

export default App;
