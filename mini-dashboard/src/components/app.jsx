import React from "react";

class App extends React.Component {
    state = {
        name: ""
    };

    render() {
        return (
            <div className="ui container" style={{ marginTop: "10px" }}>
                App
                <button className="ui red basic button">Button</button>
            </div>
        );
    }
}

export default App;
