import React from "react";
import DashboardCard from "../components/DashboardCard";
import apiProxy from "../api/apiProxy";
import PropTypes from "prop-types";

// Create a class component
class WidgetBoldChatActiveCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, boldchatCount: null };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)
        // ?FromDate=2019-01-08T08:00:01.000Z
        apiProxy
            .get(`/boldchat/${this.state.instance}/data/rest/json/v1/getActiveChats`, {
                params: {}
            })
            .then(response => {
                // Save into our component state
                this.setState({ boldchatCount: response.data.Data.length });
            });
    };

    renderCardHeader() {
        return <div className="single-num-title">BoldChats Active</div>;
    }

    renderCardBody() {
        return <div className="single-num-value">{this.state.boldchatCount}</div>;
    }

    render() {
        return (
            <DashboardCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetBoldChatActiveCount"
            >
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
WidgetBoldChatActiveCount.propTypes = {
    instance: PropTypes.string.isRequired
};

export default WidgetBoldChatActiveCount;
