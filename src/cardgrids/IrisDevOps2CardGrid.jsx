// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetIrisCloneList from "../widgetsPubSub/WidgetIrisCloneList";
import WidgetLeankitDeliveryStats from "../widgetsPubSub/WidgetLeankitDeliveryStats";
import WidgetLeankitDeliveryRemainingPoints from "../widgetsPubSub/WidgetLeankitDeliveryRemainingPoints";
import WidgetIrisWorkUnitStaleCount from "../widgetsPubSub/WidgetIrisWorkUnitStaleCount";
import WidgetLeankitDiscoveryTotalCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDiscoveryDefectCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryDefectCardCount";
import WidgetLeankitDiscoveryAvgCardAge from "../widgetsPubSub/WidgetLeankitDiscoveryAvgCardAge";
import WidgetLeankitDiscoveryOwnerList from "../widgetsPubSub/WidgetLeankitDiscoveryOwnerList";
import WidgetPubSubRecentINCBarChart from "../widgetsPubSub/WidgetPubSubRecentINCBarChart";
import WidgetLeankitDiscoveryAllOldCardList from "../widgetsPubSub/WidgetLeankitDiscoveryAllOldCardList";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisDevOps2CardGrid extends React.PureComponent {
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
                <WidgetLeankitDiscoveryAllOldCardList
                    position="span 12 / span 6"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                    numCards={15}
                    redThreshold={100}
                    amberThreshold={70}
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
                <WidgetIrisWorkUnitStaleCount
                    position="span 2 / span 2"
                    sn_instance={this.props.sn_instance}
                    daysOld={365}
                    redThreshold={60}
                    amberThreshold={20}
                />
                <WidgetLeankitDiscoveryTotalCardCount
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                    redThreshold={60}
                    amberThreshold={40}
                />
                <WidgetLeankitDiscoveryDefectCardCount
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                    redThreshold={16}
                    amberThreshold={12}
                />
                <WidgetLeankitDiscoveryAvgCardAge
                    position="span 2 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                    redThreshold={50}
                    amberThreshold={25}
                />
                <WidgetLeankitDiscoveryOwnerList
                    position="span 4 / span 2"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetPubSubRecentINCBarChart position="span 4 / span 4" sn_instance={this.props.sn_instance} num_ci={20} hours={8} />
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
