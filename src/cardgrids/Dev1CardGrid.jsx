// 3rd party
import React from "react";
import PubSub from "pubsub-js";
import PropTypes from "prop-types";

// Widgets
import WidgetSNBarChart from "../widgetsPubSub/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgetsPubSub/WidgetSNScrollableTable";
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetSNExperiment01 from "../widgetsPrototype/WidgetSNExperiment01";
import WidgetSNUniqueLoginsTodaySelfUpdating from "../widgetsSelfUpdating/WidgetSNUniqueLoginsTodaySelfUpdating";

// Other Components
import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Dev1 Dashboard");
        this.child = React.createRef();
        // So we can keep track of the once-per-second timeout
        this.intervalHandle = null;
        this.state = { refreshRemainingMs: props.refreshInterval };
    }

    triggerWidgetUpdateEvent() {}

    widgetRefreshCountdownLoop() {
        console.log("Time left: " + this.state.refreshRemainingMs);

        // Check to see if timer expired, if so trigger data update
        if (this.state.refreshRemainingMs <= 0) {
            PubSub.publish("updateWidgetsEvent", "Update your data, you widgets !");
            this.setState({ refreshRemainingMs: this.props.refreshInterval });
        }

        // Subtract one second, and then wait for one second
        this.setState({ refreshRemainingMs: this.state.refreshRemainingMs - this.props.refreshUpdateInterval });
        // Update our parent with the number of seconds remaining
        this.props.setPageCountdown(this.state.refreshRemainingMs);
    }

    componentDidMount() {
        // Create a PubSub event loop
        this.widgetRefreshCountdownLoop();

        // Trigger new timeout
        this.intervalHandle = setInterval(() => {
            this.widgetRefreshCountdownLoop();
        }, this.props.refreshUpdateInterval);
    }

    componentWillUnmount() {
        // clear the periodic timeout pubsub loop
        clearInterval(this.intervalHandle);
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
    refreshInterval: PropTypes.number.isRequired,
    setPageCountdown: PropTypes.func.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dev1CardGrid.defaultProps = { refreshUpdateInterval: 1000 };

export default Dev1CardGrid;
