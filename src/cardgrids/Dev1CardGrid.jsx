// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNBarChart from "../widgetsExperimental/WidgetChartJSBarChart";
import WidgetSNScrollableTable from "../widgetsPubSub/WidgetSNScrollableTable";
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetSNExperiment01 from "../widgetsPrototype/WidgetSNExperiment01";
import WidgetSNUniqueLoginsTodaySelfUpdating from "../widgetsSelfUpdating/WidgetSNUniqueLoginsTodaySelfUpdating";
import WidgetGoogleChartScatter from "../widgetsExperimental/WidgetGoogleChartScatter";
import WidgetGoogleChartHorizontalBar from "../widgetsExperimental/WidgetGoogleChartHorizontalBar";
import WidgetGoogleChartGauge from "../widgetsExperimental/WidgetGoogleChartGauge";
import WidgetSNPubSubJETCostDataTable from "../widgetsExperimental/WidgetSNPubSubJETCostDataTable";
import WidgetPubSubJETHorizontalGoogleBarChart from "../widgetsPubSub/WidgetPubSubJETHorizontalGoogleBarChart";

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
            <CardGrid rows="20" columns="12">
                <WidgetSNPubSubJETCostDataTable
                    position="span 4/ span 4"
                    sn_instance={this.props.sn_instance}
                    boldchat_instance={this.props.boldchat_instance}
                />
                <WidgetPubSubJETHorizontalGoogleBarChart
                    position="span 4 / span 4"
                    sn_instance={this.props.sn_instance}
                    boldchat_instance={this.props.boldchat_instance}
                />

                <WidgetSNBarChart color="#ddd" position="span 5 / span 4" sn_instance={this.props.sn_instance} />
                <WidgetSNScrollableTable position="span 4 / span 4" />
                <WidgetSNUniqueLoginsToday position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetSNExperiment01 position="span 2 / span 3" sn_instance={this.props.sn_instance} />
                <WidgetSNUniqueLoginsTodaySelfUpdating position="span 2 / span 4" sn_instance={this.props.sn_instance} />
                <WidgetGoogleChartScatter position="span 4 / span 4" sn_instance={this.props.sn_instance} />
                <WidgetGoogleChartHorizontalBar position="span 4 / span 8" sn_instance={this.props.sn_instance} />
                <WidgetGoogleChartGauge position="span 4 / span 2" boldchat_instance={this.props.boldchat_instance} />
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
