import React from "react";
import "./DashboardCard.scss";

// Create a widget class ---------
class DashboardTableCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    render() {
        let styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        return (
            <div className={"dataCard item"} id={this.props.id} style={styles}>
                {this.props.children}
            </div>
        );
    }
}

export default DashboardTableCard;
