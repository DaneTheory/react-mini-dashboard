// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNBarChart from "../widgetsPubSub/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgetsPubSub/WidgetSNScrollableTable";
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetSNExperiment01 from "../widgetsPrototype/WidgetSNExperiment01";
import WidgetSNUniqueLoginsTodaySelfUpdating from "../widgetsSelfUpdating/WidgetSNUniqueLoginsTodaySelfUpdating";

// Other project imports
import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Dev1 Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <CardGrid rows="10" columns="12">
                <WidgetSNBarChart color="#ddd" position="span 5 / span 4" instance={this.props.sn_instance} />
                <WidgetSNScrollableTable position="span 4 / span 4" />
                <WidgetSNUniqueLoginsToday position="span 2 / span 2" instance={this.props.sn_instance} />
                <WidgetSNExperiment01 position="span 2 / span 3" instance={this.props.sn_instance} />
                <WidgetSNUniqueLoginsTodaySelfUpdating position="span 2 / span 4" instance={this.props.sn_instance} />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

Dev1CardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dev1CardGrid.defaultProps = {};

export default Dev1CardGrid;

// ====================================================================================
