import React from "react";
import "./DashboardCard.scss";

// Create a widget class --------
class DashboardCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    render() {
        let styles = {};
        let cardBody_styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }
        if (this.props.chart) {
            // Override the display property if this contains a chart
            cardBody_styles.display = "flex";
        }

        return (
            <div className={"dataCard item"} id={this.props.id} style={styles}>
                <div className="cardBody" style={cardBody_styles}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default DashboardCard;
