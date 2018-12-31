import React from "react";
import "./DashboardCard.scss";

// Create a widget class ----
class DashboardCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    renderCardHeader() {
        return <span>{this.props.widgetName}</span>;
    }

    renderCardBodyTable() {
        return <div>{this.props.children}</div>;
    }

    render() {
        return (
            <div className="dataCard">
                <div className="cardHeader">{this.renderCardHeader()}</div>
                <div className="cardBody">{this.renderCardBodyTable()}</div>
            </div>
        );
    }
}

export default DashboardCard;
