import React from "react";
import DashboardCard from "./DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";

// Create a class component
class WidgetLeankitCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", instance: props.instance, count: null };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)
        apiProxy
            .get(`/leankit/${this.state.instance}/board/372745411`, {
                params: {}
            })
            .then(response => {
                // Save into our component state
                console.log(response.data.cards.length);
                this.setState({ count: response.data.cards.length });
            });
    };

    renderCardHeader() {
        return <div className="single-num-title">Leankit Count</div>;
    }

    renderCardBody() {
        return <div className="single-num-value">{this.state.count}</div>;
    }

    render() {
        return (
            <DashboardCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetLeankitCount">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardCard>
        );
    }

    // ########################################################################################
    // ########################################################################################
    // ########################################################################################

    // end of class
}

// Force the caller to include the proper attributes
WidgetLeankitCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetLeankitCount;
