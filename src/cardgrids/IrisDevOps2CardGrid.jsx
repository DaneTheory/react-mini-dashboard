// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetIrisCloneList from "../widgetsPubSub/WidgetIrisCloneList";
import WidgetLeankitDeliveryStats from "../widgetsPubSub/WidgetLeankitDeliveryStats";
import WidgetLeankitDeliveryRemainingPoints from "../widgetsPubSub/WidgetLeankitDeliveryRemainingPoints";
import WidgetIrisWUStaleCount from "../widgetsPubSub/WidgetIrisWUStaleCount";
import WidgetLeankitDiscoveryTotalCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDiscoveryDefectCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryDefectCardCount";
import WidgetLeankitDiscoveryAvgCardAge from "../widgetsPubSub/WidgetLeankitDiscoveryAvgCardAge";
import WidgetLeankitDiscoverySolutioningCardList from "../widgetsPubSub/WidgetLeankitDiscoverySolutioningCardList";
import WidgetLeankitDiscoveryOwnerList from "../widgetsPubSub/WidgetLeankitDiscoveryOwnerList";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisDevOps2CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Iris DevOps2 Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // console.log("Demo1CardGrid: render()");
        return (
            <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetLeankitDiscoverySolutioningCardList
                    position="span 10 / span 6"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetIrisCloneList position="span 6 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetLeankitDeliveryRemainingPoints
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetLeankitDeliveryStats
                    position="span 6 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetIrisWUStaleCount position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                <WidgetLeankitDiscoveryTotalCardCount
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetLeankitDiscoveryDefectCardCount
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetLeankitDiscoveryAvgCardAge
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetLeankitDiscoveryOwnerList
                    position="span 4 / span 2"
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

IrisDevOps2CardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
IrisDevOps2CardGrid.defaultProps = {
    boardId: "412731036"
};

export default IrisDevOps2CardGrid;

// ====================================================================================
