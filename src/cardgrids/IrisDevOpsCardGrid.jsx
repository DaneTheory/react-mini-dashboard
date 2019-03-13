// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetIrisINCBreachList from "../widgetsPubSub/WidgetIrisINCBreachList";
import WidgetIrisINCBreachSLACount from "../widgetsPubSub/WidgetIrisINCBreachSLACount";
import WidgetLeankitDeliveryBurndown from "../widgetsPubSub/WidgetLeankitDeliveryBurndown";
import WidgetSNPubSubPlatformHealthSummary from "../widgetsPubSub/WidgetSNPubSubPlatformHealthSummary";
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "../widgetsPubSub/WidgetSNCurrentUsers";
import WidgetSNAPICounts from "../widgetsPubSub/WidgetSNAPICounts";
import WidgetLeankitPointsByOwner from "../widgetsPubSub/WidgetLeankitPointsByOwner";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisDevOpsCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Iris DevOps Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // console.log("Demo1CardGrid: render()");
        return (
            <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetLeankitDeliveryBurndown
                    position="1 / 1 / span 6 / span 6"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetIrisINCBreachList position="7 / 1 / span 6 / span 6" sn_instance={this.props.sn_instance} />
                <WidgetIrisINCBreachSLACount position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetSNPubSubPlatformHealthSummary position="span 8 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetSNUniqueLoginsToday position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetSNCurrentUsers position="span 2/span 2" sn_instance={this.props.sn_instance} />
                <WidgetSNAPICounts position="1 / 11 / span 4 / span 2" />
                <WidgetLeankitPointsByOwner
                    position="9 / 11 / span 6 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

IrisDevOpsCardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
IrisDevOpsCardGrid.defaultProps = {
    boardId: "412731036"
};

export default IrisDevOpsCardGrid;

// ====================================================================================
