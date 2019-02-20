// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetBoldChatActiveGauge from "../widgetsPubSub/WidgetBoldChatActiveGauge";
import WidgetSNPubSubJETCostDataTable from "../widgetsExperimental/WidgetSNPubSubJETCostDataTable";
import WidgetPubSubJETHorizontalGoogleBarChart from "../widgetsPubSub/WidgetPubSubJETHorizontalGoogleBarChart";
import WidgetSNPubSubPlatformHealthSummary from "../widgetsPubSub/WidgetSNPubSubPlatformHealthSummary";
import WidgetSNBoldchatTableAutoScroll from "../widgetsPubSub/WidgetSNBoldchatTableAutoScroll";
import WidgetSNClicksByOS from "../widgetsPubSub/WidgetSNClicksByOS";
import WidgetSNNewIncidentsToday from "../widgetsPubSub/WidgetSNNewIncidentsToday";
import WidgetSNCurrentUsers from "../widgetsPubSub/WidgetSNCurrentUsers";
import WidgetBoldChatActiveCount from "../widgetsPubSub/WidgetBoldChatActiveCount";
import WidgetSNAPICounts from "../widgetsPubSub/WidgetSNAPICounts";

// Other project imports
import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Iris Dashboard (Demo1)");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // console.log("Demo1CardGrid: render()");
        return (
            <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetSNPubSubJETCostDataTable
                    position="1 / 1 / span 4/ span 4"
                    sn_instance={this.props.sn_instance}
                    boldchat_instance={this.props.boldchat_instance}
                />
                <WidgetPubSubJETHorizontalGoogleBarChart
                    position="1 / 5 / span 4 / span 4"
                    sn_instance={this.props.sn_instance}
                    boldchat_instance={this.props.boldchat_instance}
                />
                <WidgetSNPubSubPlatformHealthSummary position="1 / 9 / span 8 / span 2" sn_instance={this.props.sn_instance} />

                <WidgetSNBoldchatTableAutoScroll
                    position="5 / 1 / span 8 / span 6"
                    boldchat_instance={this.props.boldchat_instance}
                    sn_instance={this.props.sn_instance}
                />

                <WidgetSNUniqueLoginsToday position="5 / 7 / span 2 / span 2" sn_instance={this.props.sn_instance} />

                <WidgetSNClicksByOS position="7 / 7 / span 4 /span 2" sn_instance={this.props.sn_instance} />

                <WidgetBoldChatActiveGauge
                    position="9 / 9 / span 4 / span 2"
                    boldchat_instance={this.props.boldchat_instance}
                    sn_instance={this.props.sn_instance}
                />

                <WidgetSNNewIncidentsToday position="9 / 11 / span 2/span 2" sn_instance={this.props.sn_instance} />

                <WidgetSNCurrentUsers position="11 / 7 / span 2/span 2" sn_instance={this.props.sn_instance} />
                <WidgetBoldChatActiveCount
                    position="11 / 11 / span 2/span 2"
                    boldchat_instance={this.props.boldchat_instance}
                    sn_instance={this.props.sn_instance}
                />

                <WidgetSNAPICounts position="1 / 11 / span 8 / span 2" />
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
