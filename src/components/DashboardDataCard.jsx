import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

// Create a widget class ---------
class DashboardDataCard extends React.Component {
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

        return (
            <div className={"dataCard"} id={this.props.widgetName} style={styles}>
                <div className="cardBody" style={cardBody_styles}>
                    {this.props.children}
                    <ReactTooltip place="top" type="dark" effect="float" delayShow={500} delayHide={1000} multiline={true} />
                </div>
            </div>
        );
    }
}

DashboardDataCard.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    id: PropTypes.string,
    widgetName: PropTypes.string.isRequired
};

export default DashboardDataCard;
