// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetLeankitDiscoveryTotalCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDeliveryBurndown from "../widgetsPubSub/WidgetLeankitDeliveryBurndown";
import WidgetLeankitDeliveryStats from "../widgetsPubSub/WidgetLeankitDeliveryStats";
import WidgetLeankitPointsByOwner from "../widgetsPubSub/WidgetLeankitPointsByOwner";
import WidgetLeankitDeliveryRemainingPoints from "../widgetsPubSub/WidgetLeankitDeliveryRemainingPoints";

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
                        position="span 8 / span 10"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDeliveryRemainingPoints
                        position="span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDeliveryStats
                        position="3 / 11 / span 6 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitPointsByOwner
                        position="9 / 11 / span 6 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
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
    boardId: PropTypes.string.isRequired
};

export default LeankitDiscoveryCardGrid;
// ====================================================================================
