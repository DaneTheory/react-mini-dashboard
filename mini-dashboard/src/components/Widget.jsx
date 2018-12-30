import React from "react";
import "./Widget.css";

class Widget extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    render() {
        return (
            <div>
                <div className="dataCard">
                    <span>widgetName:</span> {this.state.widgetName}
                </div>
            </div>
        );
    }
}

export default Widget;
