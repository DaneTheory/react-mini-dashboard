import React from "react";
import "./Widget.scss";

// Create a widget class ----
class Widget extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    renderCardHeader() {
        return (
            <span>
                <span>widgetName:</span> {this.props.widgetName}
            </span>
        );
    }
    renderCardBody() {
        var listOfNames = this.props.widgetBody.map(function(name, index) {
            return <li key={index}>{name}</li>;
        });
        return <ol>{listOfNames}</ol>;
    }

    render() {
        return (
            <div className="dataCard">
                <div className="cardHeader">{this.renderCardHeader()}</div>
                <div className="cardBody">{this.renderCardBody()}</div>
            </div>
        );
    }
}

export default Widget;
