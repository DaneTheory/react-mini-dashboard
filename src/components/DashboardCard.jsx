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
        let styles = {};
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        return (
            <div className={"dataCard item item--" + this.props.id} id={this.props.id} style={styles}>
                <div className="cardBody">{this.renderCardBodyTable()}</div>
            </div>
        );
    }
}

export default DashboardCard;
