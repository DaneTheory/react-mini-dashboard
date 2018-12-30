import React from "react";
import Widget from "./Widget";

class App extends React.Component {
    state = {
        name: ""
    };

    render() {
        return (
            <div className="ui container" style={{ marginTop: "10px" }}>
                App
                <br />
                <button className="ui green basic button">Button</button>
                <Widget />
            </div>
        );
    }
}

export default App;
