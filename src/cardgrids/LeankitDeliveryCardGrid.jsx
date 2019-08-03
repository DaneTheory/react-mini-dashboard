// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetLeankitDeliveryBurndown from "../widgetsPubSub/WidgetLeankitDeliveryBurndown";
import WidgetLeankitDeliveryStats from "../widgetsPubSub/WidgetLeankitDeliveryStats";
import WidgetLeankitPointsByOwner from "../widgetsPubSub/WidgetLeankitPointsByOwner";
import WidgetLeankitDeliveryRemainingPoints from "../widgetsPubSub/WidgetLeankitDeliveryRemainingPoints";
import WidgetIrisWUStaleList from "../widgetsPubSub/WidgetIrisWUStaleList";
import WidgetIrisWUStaleCount from "../widgetsPubSub/WidgetIrisWUStaleCount";
import WidgetLeankitBlockedCards from "../widgetsPubSub/WidgetLeankitBlockedCards";
import WidgetLeankitHuddleCards from "../widgetsPubSub/WidgetLeankitHuddleCards";

// Other project imports
import CardGrid from "../components/cardGrid";

class LeankitDiscoveryCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        props.changeParentPageTitle("Leankit Delivery Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="30" columns="12">
                    <WidgetLeankitDeliveryBurndown
                        position="span 6 / span 6"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDeliveryRemainingPoints
                        position="span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDeliveryStats
                        position="1 / 11 / span 6 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitPointsByOwner
                        position="1 / 9 / span 6 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitBlockedCards
                        position="7 / 1 / span 6 / span 6"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                        redThreshold={30}
                        amberThreshold={14}
                    />
                    <WidgetLeankitHuddleCards
                        position="7 / 7 / span 6 / span 6"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetIrisWUStaleList
                        position="span 8 / span 6"
                        sn_instance={this.props.sn_instance}
                        redThreshold={1.5}
                        amberThreshold={1.0}
                    />
                    <WidgetIrisWUStaleCount position="3 / 7 / span 2 / span 2" sn_instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
LeankitDiscoveryCardGrid.defaultProps = {
    boardId: "412731036"
};

LeankitDiscoveryCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired
};

export default LeankitDiscoveryCardGrid;
// ====================================================================================
