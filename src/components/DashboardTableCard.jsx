import React from "react";
import PropTypes from "prop-types";

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

DashboardTableCard.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    id: PropTypes.string
};

export default DashboardTableCard;
