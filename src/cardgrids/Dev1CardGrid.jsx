// 3rd party
import React from "react";
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
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        this.child = React.createRef();
        // So we can keep track of the once-per-second timeout
        this.intervalHandle = null;
        this.state = { refreshRemainingMs: props.refreshInterval };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Dev1CardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dev1CardGrid.defaultProps = {};

export default Dev1CardGrid;
