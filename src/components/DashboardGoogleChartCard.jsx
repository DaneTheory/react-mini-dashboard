import React from "react";
import PropTypes from "prop-types";

// I've got two kinds of cards
// DashboardChartJSCard
//    Doesn't have a cardBody div within it
//    Listens for a window.resize() event, and triggers scroll event against itself (related to closing of sidbar)
// DashboardDataCard
//    Does have a cardBody div (for text formatting, I guess)

// Create a widget class --------
class DashboardGoogleChartCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
    }

    componentDidMount() {}

    componentWillUnmount() {}

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
            <div className={"googleChartCard"} id={this.props.id} style={styles}>
                {this.props.children}
            </div>
        );
    }
}

DashboardGoogleChartCard.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    id: PropTypes.string
};

export default DashboardGoogleChartCard;
