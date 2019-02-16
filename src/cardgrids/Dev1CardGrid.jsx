// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNExperiment01 from "../widgetsPrototype/WidgetSNExperiment01";
import WidgetSNUniqueLoginsTodaySelfUpdating from "../widgetsSelfUpdating/WidgetSNUniqueLoginsTodaySelfUpdating";
import WidgetGoogleChartScatter from "../widgetsExperimental/WidgetGoogleChartScatter";
import WidgetGoogleChartHorizontalBar from "../widgetsExperimental/WidgetGoogleChartHorizontalBar";

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
            <CardGrid rows="20" row_height="3.5vw" columns="12" column_width="1fr">
                {/* <WidgetSNBarChart color="#ddd" position="span 5 / span 4" sn_instance={this.props.sn_instance} /> */}

                {/* <WidgetSNScrollableTable position="span 4 / span 4" /> */}
                <WidgetSNExperiment01 position="span 2 / span 3" sn_instance={this.props.sn_instance} />
                <WidgetSNUniqueLoginsTodaySelfUpdating position="span 2 / span 4" sn_instance={this.props.sn_instance} />
                <WidgetGoogleChartScatter position="span 4 / span 4" sn_instance={this.props.sn_instance} />
                <WidgetGoogleChartHorizontalBar position="span 4 / span 8" sn_instance={this.props.sn_instance} />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

Dev1CardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired,
    boldchat_instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dev1CardGrid.defaultProps = {};

export default Dev1CardGrid;

// ====================================================================================
