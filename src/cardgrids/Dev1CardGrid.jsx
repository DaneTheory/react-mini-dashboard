// 3rd party
import React from "react";
import PubSub from "pubsub-js";
import PropTypes from "prop-types";

// Widgets
import WidgetSNBarChart from "../widgets/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgets/WidgetSNScrollableTable";
import WidgetSNUniqueLoginsToday from "../widgets/WidgetSNUniqueLoginsToday";
import WidgetSNExperiment01 from "../widgetsPubSub/WidgetSNExperiment01";
import WidgetSNUniqueLoginsTodaySelfUpdating from "../widgetsSelfUpdating/WidgetSNUniqueLoginsTodaySelfUpdating";

// Other Components
import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Dev1 Dashboard");
        this.child = React.createRef();
        this.timeoutHandle = null;
        this.state = { refreshRemainingMs: parseInt(props.refreshInterval) };
    }

    triggerWidgetUpdateEvent() {}

    widgetRefreshCountdownLoop(timemoutInMs) {
        console.log("Time left: " + this.state.refreshRemainingMs);

        // Check to see if timer expired, if so trigger data update
        if (this.state.refreshRemainingMs === 0) {
            PubSub.publish("updateWidgetsEvent", "Update your data, you widgets !");
            this.setState({ refreshRemainingMs: parseInt(this.props.refreshInterval) });
        }

        // Subtract one second, and then wait for one second
        this.setState({ refreshRemainingMs: this.state.refreshRemainingMs - 1000 });
        this.props.setPageCountdown(this.state.refreshRemainingMs);
        this.timeoutHandle = setTimeout(() => {
            this.widgetRefreshCountdownLoop(timemoutInMs - 1000);
        }, 1000);
    }

    componentDidMount() {
        // Create a PubSub event loop
        this.widgetRefreshCountdownLoop(parseInt(this.props.refreshInterval));
    }

    componentWillUnmount() {
        // clear the periodic timeout pubsub loop
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return (
            <div>
                <CardGrid rows="10" columns="12">
                    <WidgetSNBarChart color="#ddd" position="span 5 / span 4" instance={this.props.sn_instance} />
                    <WidgetSNScrollableTable position="span 4 / span 4" />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 2" instance={this.props.sn_instance} interval={20} />
                    <WidgetSNExperiment01 ref={this.child} position="span 2 / span 3" instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsTodaySelfUpdating position="span 2 / span 4" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

Dev1CardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired,
    refreshInterval: PropTypes.string.isRequired,
    setPageCountdown: PropTypes.func.isRequired
};

export default Dev1CardGrid;
