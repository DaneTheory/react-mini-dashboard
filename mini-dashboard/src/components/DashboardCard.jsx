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
        let styles = {
            backgroundColor: this.props.color,
            gridArea: this.props.position
        };

        return (
            <div className={"dataCard item item--" + this.props.id} id={this.props.id} style={styles}>
                <div className="cardBody">{this.renderCardBodyTable()}</div>
            </div>
        );
    }
}

export default DashboardCard;
